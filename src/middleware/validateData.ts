// src/middlewares/validateData.ts
import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

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
      
      if (validatedData.body) {
        // 1. Delete every key in the original dirty request body
        Object.keys(req.body).forEach(key => delete req.body[key]);
        // 2. Put ONLY the clean Zod data back inside
        Object.assign(req.body, validatedData.body);
      }

      if (validatedData.query) {
        Object.keys(req.query).forEach(key => delete req.query[key]);
        Object.assign(req.query, validatedData.query);
      }

      if (validatedData.params) {
        Object.keys(req.params).forEach(key => delete req.params[key]);
        Object.assign(req.params, validatedData.params);
      }

      // 3. Move to the controller
      next();
      
    } catch (error) {
      next(error);  
    }
  }
};