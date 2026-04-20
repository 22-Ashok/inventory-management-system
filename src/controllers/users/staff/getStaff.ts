import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../utils/appError";
import type {EditUserByStaffBodyType, EditUserByStaffParamType} from "../../../schemas/editUserSchema";
import { prisma } from "../../../lib/prisma";

export async function getStaff(req: Request, res: Response, next: NextFunction) {
    try{
        const user = req.user;

        if(!user){
          throw new ApiError(401, "Unauthorized. Please log in.");
        }

        if(user.role !== "STAFF"){
            throw new ApiError(403, "Access denied. Staff only.");
        }

        const params = req.params as unknown as EditUserByStaffParamType;
        const body = req.body as unknown as EditUserByStaffBodyType;

        const userData = await prisma.user.findUnique({
            where: {id: user.userId},
                select: {
                    id: true,
                    email:true,
                    f_name:true,
                    l_name:true,
                    contact:true,
                    role:true
                }
        });

        return res.status(200).json({
            status: true,
            data: userData,
            error: null,
            message:" User data featched successfully"
        });
    }

    catch(error) {
        next(error);
    }
}