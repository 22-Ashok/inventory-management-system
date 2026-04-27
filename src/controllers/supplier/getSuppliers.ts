import type {Request, Response, NextFunction} from "express"
import {prisma} from "../../lib/prisma"
import type {getSupplierQueryType} from "../../schemas/supplierSchema"


export async function getSuppliers(
  req: Request<any, any, any, getSupplierQueryType>, 
  res: Response, 
  next: NextFunction
) {
  try {
    const { search, email, contact } = req.query;

    const supplier = await prisma.supplier.findMany({
      where: {
        // 1. Global Search
        ...(search ? {
          OR: [
            { f_name: { contains: search, mode: "insensitive" } },
            { l_name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { contact: { contains: search, mode: "insensitive" } },
          ],
        } : {})
      },
      select: {
        id: true,
        f_name: true,
        l_name: true,
        email: true,
        contact: true,
        address: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Suppliers data fetched successfully",
      data: supplier,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}