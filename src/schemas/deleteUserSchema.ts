import {z} from "zod";

export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: "Invalid user ID format" }),
    })
})

export type DeleteUserParamType = z.infer<typeof deleteUserSchema>['params'];