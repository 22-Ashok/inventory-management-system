import z from 'zod';

export const createSupplierSchema = z.object({
    body: z.object({
        f_name : z.string().min(1, "First name is required"),
        l_name : z.string().optional(),
        email: z.string().email("Invalid email address"),
        contact: z.string().min(10, "Contact number must be at least 10 digits"),
        address: z.string(),
        status: z.enum(['active', 'inactive']).optional(),
    })
    
});


export type SupplierBodyType = z.infer<typeof createSupplierSchema>['body'];

export const updateSupplierSchema = z.object({
    body: z.object({
        f_name : z.string().min(1, "First name is required").optional(),
        l_name : z.string().optional().optional(),
        contact: z.string().min(10, "Contact number must be at least 10 digits").optional(),
        address: z.string().optional(),
        status: z.enum(['active', 'inactive']).optional(),
    }).strict()
})

export type supplierUpdateBodyType = z.infer<typeof updateSupplierSchema>['body'];

export const getSupplierQuerySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        email:z.string().optional(),
        contact:z.string().optional()
    })
})

export type getSupplierQueryType = z.infer<typeof getSupplierQuerySchema>['query'];