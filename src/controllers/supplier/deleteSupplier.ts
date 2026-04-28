import type {Request, Response, NextFunction} from "express"
import {prisma} from "../../lib/prisma"
import { ApiError } from "../../utils/appError";


export async function deleteSupplier(req:Request<{id:string}>, res:Response, next:NextFunction) {
    try {
      
        if(!req.params.id) {
            throw new ApiError(400, "please provide valid supplier-id");
        }

        await prisma.supplier.delete({
            where: {id: req.params.id}
        });

        return res.status(200).json({
            status: true,
            message:"user deleted successfully",
            error: null
        });
    }

    catch(error) {
        next(error);
    }
}