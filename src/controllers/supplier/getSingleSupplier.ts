import type {Request, Response, NextFunction} from "express"
import {prisma} from  "../../lib/prisma"
import { ApiError } from "../../utils/appError";

export async function getSingleSupplier(req:Request<{id:string}>, res:Response, next:NextFunction) {
    try {

        if(!req.params.id){
            throw new ApiError(400, "please provide valid supplier-id");
        }

        const supplier = await prisma.supplier.findUnique({
            where: {
                id:req.params.id
            }, 
            omit:{
              createdAt:true,
              updatedAt:true
            }
        });

        return res.status(200).json({
            status:true,
            message:"data fetch successfully",
            data: supplier,
            error: null
        })
    }

    catch(error){
      next(error);
    }
}
