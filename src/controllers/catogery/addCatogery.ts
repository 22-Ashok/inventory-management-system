import type {Request, Response, NextFunction} from "express"
import { prisma } from "../../lib/prisma"
import { ApiError } from "../../utils/appError";
import type {CreateCategoryBody} from "../../schemas/catogerySchema";


export async function addCatogery(
   req: Request<any, any, CreateCategoryBody>, 
   res: Response, 
   next: NextFunction) 
   {
   try{
     const user = req.user;

     if(!user){
        throw new ApiError(401, "Unauthorized");
     }

     if(user.role !== "ADMIN") {
        throw new ApiError(403, "Forbidden");
     }

     const {name, description} = req.body;

     if(!name) {
        throw new ApiError(400, "catogery Name is required");
     }

        const catogery = await prisma.category.create({
            data: { name,  description: description ?? null },
            select:{
                id:true,
                name:true,
                description:true
            }
        });

        res.status(201).json({
            status: true,
            data: catogery,
            error: null
        });
   } 

   catch(error) {
     next(error);
   }
}