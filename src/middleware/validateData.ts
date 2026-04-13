// src/middlewares/validateData.ts
import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateData = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
      
    } catch (error) {
      console.log(error);
      next(error);  
    }
  }
};