import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/appError";
import dotenv from "dotenv";
dotenv.config();


// controllers/authController.ts
export const setupPermanentPassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization; // Contains the setupToken

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new ApiError(401, "Authorization header missing or malformed.");
        }
           
        // 1. Verify the restricted token
        const token = authHeader.split(' ')[1];

        if(!token) {
            throw new ApiError(401, "Token missing from Authorization header.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as any;

        // Security Check: Make sure this is a setup token, not a normal token
        if (decoded.intent !== 'PASSWORD_SETUP') {
            throw new ApiError(403, "Invalid token type for this operation.");
        }

        // 2. Hash the new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // 3. Update the user in the database
        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: {
            password: newPasswordHash,
            is_password_set: true // FLIP THE FLAG!
            }
        });

        // 4. Issue the REAL access token so they are immediately logged in
        const accessToken = jwt.sign(
            { userId: updatedUser.id, role: updatedUser.role }, 
            process.env.JWT_SECRET_KEY as string
        );

        return res.status(200).json({
            message: "Password updated successfully. Welcome!",
            accessToken,
            user: { id: updatedUser.id, role: updatedUser.role },
            error: null
        });
    }

    catch(error) {
        next(error)
    }

};