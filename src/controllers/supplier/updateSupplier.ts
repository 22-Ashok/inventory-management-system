import type {Request, Response, NextFunction} from "express"
import {prisma} from "../../lib/prisma"
import {ApiError} from "../../utils/appError"
import type { supplierUpdateBodyType } from "../../schemas/supplierSchema";

export async function updateSupplier(req:Request<{id:string}, any, supplierUpdateBodyType>, res:Response, next:NextFunction) {
    try {
       const user = req.user;
       
       if(!user || user.role !== "ADMIN") {
          throw new ApiError(403, "Unauthorize");
       }

       if(!req.params.id) {
          throw new ApiError(400, "supplier id not found")
       }

       // filter out the undefined value
       const filteredBody = Object.fromEntries(
            Object.entries(req.body).filter(([_, value]) => value !== undefined)
            ) as Partial<supplierUpdateBodyType>;

       const supplier = await prisma.category.update({
         where:{ id:req.params.id },
         data: filteredBody,
       });

       res.status(200).json({
        status: true,
        message:"supplier updated successfully",
        data: supplier,
        error: null
       });
    }

    catch(error) {
        next(error);
    }
}