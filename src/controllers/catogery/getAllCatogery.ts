import type {Request, Response, NextFunction} from "express"
import { prisma } from "../../lib/prisma"
import { success } from "zod";

export async function getAllCatogery(
    req:Request, 
    res:Response, 
    next:NextFunction) {
    try{ 
        
        const catogeries = await prisma.category.findMany({
            select:{
                id:true,
                name:true,
                description:true
            },

            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success:true,
            data: catogeries,
            message:"catogeries retrieved successfully",
            error: null
        });
    }

    catch(error){
        next(error);
    }

    }