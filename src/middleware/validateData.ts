// src/middlewares/validateData.ts
import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateData = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Parse the incoming data against your schema
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: any; query?: any; params?: any; };

      // 2. Safely mutate the request objects with the clean data
      // Object.assign bypasses the "read-only" error by updating the object's contents 
      // instead of trying to replace the whole object.
      if (validatedData.body) Object.assign(req.body, validatedData.body);
      if (validatedData.query) Object.assign(req.query, validatedData.query);
      if (validatedData.params) Object.assign(req.params, validatedData.params);

      // 3. Move to the controller
      next();
      
    } catch (error) {
      next(error);  
    }
  }
};