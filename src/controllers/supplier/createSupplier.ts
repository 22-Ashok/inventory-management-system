import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/appError';
import { prisma } from '../../lib/prisma';
import type { SupplierBodyType } from "../../schemas/supplierSchema"; 

export async function createSupplier(
    req: Request<{}, {}, SupplierBodyType>, 
    res: Response, 
    next: NextFunction
) {
    try {
        const user = req.user;
        if (!user || user.role !== 'ADMIN') {
            throw new ApiError(403, 'Forbidden');
        }

        // 1. Destructure exactly what Zod validated
        const { f_name, l_name, email, contact, address, status } = req.body;

        // 2. Generate the Supplier Code
        const result = await prisma.$queryRaw<[{ nextval: bigint }]>`SELECT nextval('supplier_code_seq')`;
        const sequenceNumber = Number(result[0].nextval);
        const supplierCode = `SP-${String(sequenceNumber).padStart(4, '0')}`;

        // 3. Explicitly map the data to Prisma
        const newSupplier = await prisma.supplier.create({
            data: {
                // Required fields go in directly
                supplier_code: supplierCode,
                f_name: f_name,
                contact: contact,
                address: address,
                l_name: l_name ?? null,
                email: email ?? null,
            }
        });

        return res.status(201).json({ 
            status: "success", 
            data: newSupplier,
            error: null
        });

    } catch(error) {
        next(error);
    }
}