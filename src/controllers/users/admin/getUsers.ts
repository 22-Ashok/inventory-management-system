import type {Request, Response, NextFunction} from 'express';
import { prisma } from '../../../lib/prisma';
import type { GetAllStaffQuery } from "../../../schemas/getAllStaffQerrySchema"


export const getUsers = async ( 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Because of our Zod middleware, we guarantee page and limit are numbers
    
    const query = req.query as unknown as GetAllStaffQuery;
    let { page, limit, sortBy, sortOrder, role, status, search } = query;

    page = Number(query.page);
    limit = Number(query.limit);

    const skip = (page - 1) * limit;

    // 3. Build the 'where' clause dynamically
    // Prisma is smart: if role or status are 'undefined', it simply ignores them.
    const whereClause: any = {
      role: role,
      status: status,
    };

    // Only add the fuzzy search if the user actually typed a search query
    if (search) {
      whereClause.OR = [
        { f_name: { contains: search, mode: "insensitive" } },
        { l_name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }, 
      ];
    }

    // 4. Added 'await'
    const users = await prisma.user.findMany({
      select: {
        id: true,
        f_name: true,
        l_name: true,
        email: true,
        contact: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      take: limit as number,
      skip: skip as number,
      
      // 5. Use dynamic keys for sorting. 
      // Fallback to sorting by createdAt if sortBy isn't provided.
      orderBy: sortBy 
        ? { [sortBy]: sortOrder } 
        : { createdAt: sortOrder },
        
      where: whereClause,
    });

    // 6. Optional but recommended: Get the total count for frontend pagination
    const totalUsers = await prisma.user.count({ where: whereClause });

    return res.status(200).json({
      status: "success",
      data: {
        users,
        meta: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        }
      },
      error: null,
    });

  } catch (error) {
    next(error);
  }
};