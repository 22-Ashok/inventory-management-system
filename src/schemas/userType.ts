import { z } from "zod";

const RoleEnum = z.enum(["USER", "ADMIN", "STAFF"]);

//    ============================================================================
//                                  user schema
//     ===========================================================================

export const userSchema = z.object({
  id: z.string().uuid().optional(), 
  
  email: z.string().email({ message: "Invalid email address" }),
  
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(16, { message: "Password must be at most 16 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
  
  f_name: z.string().min(1, { message: "First name is required" }).default("user"),
  
  l_name: z.string().min(1, { message: "Last name is required" }).optional(),
  
  contact: z
    .string()
    .regex(
      /^(?:\+91|91|0)?[6-9]\d{9}$/, 
      { message: "Must be a valid Indian phone number" }
    ),
  
  lastActive: z.date().optional(),
  role: RoleEnum.default("USER"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});



// Type inference so you can use this type throughout your TypeScript code
export type UserType = z.infer<typeof userSchema>;

/**
    - The typeof keyword bridges that gap by telling TypeScript, "Look at this variable and figure out its shape." 
    - z.infer<> ->  It takes that shape from step 1 and translates it into a pure TypeScript type.
*/



/* login schema  */

//    ============================================================================
//                                  login schema
//     ===========================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  
  password: z
    .string()
    .min(1, { message: "Password is required" })
});

// Generate the TypeScript type automatically
export type LoginType = z.infer<typeof loginSchema>;