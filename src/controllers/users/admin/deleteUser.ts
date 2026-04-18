import type {Request, Response, NextFunction} from "express";
import { ApiError } from "../../../utils/appError";
import { prisma } from "../../../lib/prisma";
import type { DeleteUserParamType } from "../../../schemas/deleteUserSchema";

export async function deleteUser(req:Request, res:Response, next:NextFunction) {
    try {
        const user = req.user;

        if(!user){
           throw new ApiError(401, "Unauthorized. Please log in.");
        }

        if(user.role !== "ADMIN"){
            throw new ApiError(403, "Access denied. Admins only.");
        }

        const params = req.params as unknown as DeleteUserParamType;

        const {id} = params;

        await prisma.user.update({ // toggle the status of the user
            where: {id},
            data: {
                status: "INACTIVE"
            }
        }); 

        return res.status(200).json({
            status: true,
            message: "user is deleted successfully",
            error: null
        })
    }

    catch(error){
        next(error);
    }
}