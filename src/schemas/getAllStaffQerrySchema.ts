import { z } from 'zod';

// ============================================================================
//                            GET ALL STAFF SCHEMA
// ============================================================================
export const getAllStaffSchema = z.object({
  
  // We explicitly declare that all these fields belong in the URL query string
  query: z.object({
    // Pagination

    page: z.coerce.number().int("Page must be a whole number").min(1).default(1),
    limit: z.coerce.number().int("Limit must be a whole number").min(1).max(100).default(10),

    // Sorting
    sortBy: z.enum(['createdAt', 'name', 'role', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),

    // Filtering
    role: z.enum(['admin', 'manager', 'staff']).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),

    // Searching
    search: z.string().optional(),
  })
});

// Extract the exact type of the query object for your Express controller
export type GetAllStaffQuery = z.infer<typeof getAllStaffSchema>['query'];