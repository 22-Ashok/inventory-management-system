import type {NextFunction, Request, Response} from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client"
import {ApiError} from "../utils/appError";

export function errorHandler(err:any, req:Request, res:Response, next:NextFunction){

    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            status:"false",
            message: err.message
        })
    }
   
    else if(err instanceof ZodError){
        return res.status(400).json({
            status:"false",
            message: err.issues.map((e) => e.message).join(", ")
        })
    }

    else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2002") {
            return res.status(409).json({
                status:"false",
                message: "User already exists"
            })
        }
    } 

    else {
        console.log(err);
        return res.status(500).json({
            status:"false",
            message: "Internal Server Error"
        })
    }
}