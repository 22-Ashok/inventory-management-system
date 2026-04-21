import { z } from "zod";

const RoleEnum = z.enum(["USER", "ADMIN", "STAFF"]);

// ============================================================================
//                               CREATE USER SCHEMA
// ============================================================================
export const createUserSchema = z.object({
  // We wrap the fields the client sends in the 'body' object
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    
    f_name: z.string().min(1, { message: "First name is required" }).default("user"),
    
    l_name: z.string().min(1, { message: "Last name is required" }).optional(),
    
    contact: z
      .string()
      .regex(
        /^(\+?\d{1,3}[- ]?)?\d{6,14}$/,
        { message: "Must be a valid phone number" }
      ),
      
    role: RoleEnum.default("USER"),
  })
});

// Type inference: Notice how we add ['body'] at the end!
// This ensures your controller gets the exact type of the data inside req.body.
export type CreateUserBody = z.infer<typeof createUserSchema>['body'];


// ============================================================================
//                               LOGIN SCHEMA
// ============================================================================
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(16, { message: "Password must be at most 16 characters long" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
  })
});

export type LoginBody = z.infer<typeof loginSchema>['body'];


// ============================================================================
//                            PASSWORD RESET SCHEMA
// ============================================================================
export const resetPasswordSchema = z.object({
  // The new password comes in the request body
  body: z.object({
    newPassword: z.string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(16, { message: "Password must be at most 16 characters long" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, { message: "Password must contain at least one special character" })
  }),

  // BONUS: Usually, password resets require a token in the URL parameters!
  // e.g., POST /api/users/reset-password/:token
  /*params: z.object({
    token: z.string({ required_error: "Reset token is required" })
  }).optional() // I made this optional in case you are handling tokens differently (like in headers) */
});

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>['body'];
// export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>['params'];

