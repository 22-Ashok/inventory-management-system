import type {Request, Response, NextFunction} from "express";
import { ZodError } from "zod";



export function errorHandler(err:any, req:Request, res:Response){
   
    if(err instanceof ZodError){
        return res.status(400).json({
            status:"false",
            message: err.issues.map((e) => e.message).join(", ")
        })
    }

    else {
        console.log(err);
        return res.status(500).json({
            status:"false",
            message: "Internal Server Error"
        })
    }
}