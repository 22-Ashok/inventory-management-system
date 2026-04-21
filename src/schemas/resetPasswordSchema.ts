// src/schemas/resetPasswordSchema.ts
import { z } from "zod";

// 1. Define the Zod Schema (The Validation Rules)
export const resetPasswordSchema2 = z.object({
    body: z.object({
        email: z
            .string()
            .email({ message: "Invalid email address format" }),
        
        resetToken: z
            .string()
            .min(20, { message: "Invalid or malformed reset token" }), 
            
        newPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(16, { message: "Password must be at most 16 characters long" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[\W_]/, { message: "Password must contain at least one special character" })
    }).strict() 
});

// 2. Automatically generate the TypeScript Type from the Schema
export type ResetPasswordBodyType = z.infer<typeof resetPasswordSchema2>['body'];