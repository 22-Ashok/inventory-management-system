import type {Request, Response, NextFunction} from "express";
import {prisma} from "../../lib/prisma";
import { ApiError } from "../../utils/appError";
import type {DeleteCategoryParams} from "../../schemas/catogerySchema"

export async function deleteCatogery(
   req: Request<DeleteCategoryParams>, 
   res: Response,
   next: NextFunction  
  ) {

    try{
        const user = req.user;

        if(!user){
            throw new ApiError(401, "Unauthorized");
        }

        if(user.role !== "ADMIN") {
            throw new ApiError(403, "Forbidden");
        }

        const {id} = req.params;

        await prisma.category.delete({
            where: {id: id as string}
        });

        return res.status(200).json({
            status:true,
            message:"category deleted successfully",
            data:null,
            error:null
        })
    }

    catch(error){
        next(error);
    }
  }   