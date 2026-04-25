import type {Request, Response, NextFunction} from "express"
import { prisma } from "../../lib/prisma"
import { ApiError } from "../../utils/appError";
import type {UpdateCategoryParams,UpdateCategoryBody } from "../../schemas/catogerySchema";

export async function updateCatogery(
   req:Request<UpdateCategoryParams, any, UpdateCategoryBody>, 
   res:Response, 
   next:NextFunction){
    try{
       const user = req.user;
      
           if(!user){
              throw new ApiError(401, "Unauthorized");
           }
      
           if(user.role !== "ADMIN") {
              throw new ApiError(403, "Forbidden");
           }

           const {id} = req.params;
           const {name, description} = req.body;

           // write the logic to remove the undefined value from the req body
           const data = Object.fromEntries(
               Object.entries(req.body).filter(([_, value]) => value !== undefined)
               );

           const updatedField = await prisma.category.update({
              where: {id: id as string},
              data: data
           });

           return res.status(200).json({
              status: true,
              data: updatedField,
              error: null
           })
    }

    catch(error){
        next(error);
    }
}