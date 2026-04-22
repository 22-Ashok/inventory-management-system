// src/schemas/category.schema.ts
import { z } from "zod";

// ==========================================
// 1. CREATE CATEGORY
// Method: POST /category
// ==========================================
export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, { message: "Category name must be at least 2 characters long" }),
        description: z.string().optional(),
    }).strict(), 
});

// ==========================================
// 2. UPDATE CATEGORY
// Method: PATCH /category/:id
// ==========================================
export const updateCategorySchema = z.object({
    params: z.object({
        // THE FIX: Enforce strict UUID validation here
        id: z.string().uuid({ message: "Invalid Category ID format. Must be a valid UUID." }),
    }),
    body: z.object({
        name: z.string().min(2, { message: "Category name must be at least 2 characters" }).optional(),
        description: z.string().optional(),
    }).strict(),
});

// ==========================================
// 3. DELETE CATEGORY
// Method: DELETE /category/:id
// ==========================================
export const deleteCategorySchema = z.object({
    params: z.object({
        // THE FIX: Enforce strict UUID validation here too
        id: z.string().uuid({ message: "Invalid Category ID format. Must be a valid UUID." }),
    }),
});

// ==========================================
// TYPE EXPORTS (For your Controllers)
// ==========================================
export type CreateCategoryBody = z.infer<typeof createCategorySchema>['body'];

export type UpdateCategoryParams = z.infer<typeof updateCategorySchema>['params'];
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>['body'];

export type DeleteCategoryParams = z.infer<typeof deleteCategorySchema>['params'];