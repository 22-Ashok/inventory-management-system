import {z} from "zod";

const RoleEnum = z.enum(["USER", "ADMIN", "STAFF"]);
const StatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);


export const editUserSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }).optional(),
        f_name: z.string().min(1, { message: "First name is required" }).optional(),
        l_name: z.string().min(1, { message: "Last name is required" }).optional(),
        contact: z.string().regex(/^(\+?\d{1,3}[- ]?)?\d{6,14}$/, { message: "Must be a valid phone number" }).optional(),
        role: RoleEnum.optional(),
        status: StatusEnum .optional(),
        password: z
                .string()
                .min(6, { message: "Password must be at least 6 characters long" })
                .max(16, { message: "Password must be at most 16 characters long" })
                .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
                .regex(/[0-9]/, { message: "Password must contain at least one number" })
                .regex(/[\W_]/, { message: "Password must contain at least one special character" }).optional(),
    }), 

    params: z.object({
        id: z.string().uuid({ message: "Invalid user ID format" }),
    })
});

export type EditUserBodyType = z.infer<typeof editUserSchema>['body'];
export type EditUserParamType = z.infer<typeof editUserSchema>['params'];