import type {Request, Response, NextFunction} from "express";


export function login(req:Request, res:Response, next:NextFunction) {
    try{
      const {email, password} = req.body;
    }

    catch(error){

    }
}