import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/appError";
import { prisma } from "../../lib/prisma";
import { redis } from "../../services/upStashRedis";
import type {ResetPasswordBodyType} from "../../schemas/resetPasswordSchema";

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {

        const body = req.body as unknown as ResetPasswordBodyType;
        
        const { email, newPassword, resetToken } = body;

        // 1. Reconstruct the Redis key for the RESET TOKEN (Not the OTP!)
        const redisKey = `password_reset_token:${email}`;

        // 2. Fetch the stored token from Redis
        const storedToken = await redis.get(redisKey);

        // 3. Validate the Token
        // If it doesn't exist, they either took longer than 15 mins, 
        // or they are a hacker trying to bypass Route 2.
        if (!storedToken || storedToken !== resetToken) {
            throw new ApiError(401, "Unauthorized. Reset session expired or invalid.");
        }

        // 4. Hash the new password securely
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // 5. Update the user's password in the database
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // 6.  CRITICAL: Delete the token so it cannot be reused!
        await redis.del(redisKey);

        // 7. Send success response
        return res.status(200).json({
            status: "success",
            message: "Password has been successfully reset. You can now log in.",
            error: null
        });

    } catch(error) {
        next(error);
    }
}