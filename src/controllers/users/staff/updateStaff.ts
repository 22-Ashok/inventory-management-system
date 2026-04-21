import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../utils/appError";
import  { editUserByStaffSchema } from "../../../schemas/editUserSchema"
import type {EditUserByStaffBodyType, EditUserByStaffParamType} from "../../../schemas/editUserSchema";
import { prisma } from "../../../lib/prisma";


export async function updateStaff(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;

        if(!user){
            throw new ApiError(401, "Unauthorized. Please log in.");
        }

        if(user.role !== "STAFF"){
            throw new ApiError(403, "Access denied. Staff only.");
        }

        const params = req.params as unknown as EditUserByStaffParamType;
        const body = req.body as unknown as EditUserByStaffBodyType;

        const cleanedData = Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined));

        await prisma.user.update({
            where: {id: user.userId},
            data: cleanedData
        });

        return res.status(200).json({
            status:true,
            message:"User updated successfully",
            error:null
        });

    }

    catch(error){
        next(error)
    }
}