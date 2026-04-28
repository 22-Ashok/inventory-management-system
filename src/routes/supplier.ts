import express from 'express';
import { validateData } from '../middleware/validateData';
import { createSupplierSchema, updateSupplierSchema} from '../schemas/supplierSchema';
import { attachUserRole } from '../controllers/attachRole';
import { createSupplier } from '../controllers/supplier/createSupplier';
import { deleteSupplier } from '../controllers/supplier/deleteSupplier';
import { getSingleSupplier } from '../controllers/supplier/getSingleSupplier';
import { getSuppliers } from '../controllers/supplier/getSuppliers';
import { updateSupplier } from '../controllers/supplier/updateSupplier';


const router = express.Router();


router.post("/suppliers", validateData(createSupplierSchema), attachUserRole,  createSupplier)
router.get("/suppliers", attachUserRole, getSuppliers)
router.get("/suppliers/:id", attachUserRole,  getSingleSupplier)
router.delete("/suppliers/:id", attachUserRole,  deleteSupplier)
router.patch("/suppliers/:id", validateData(updateSupplierSchema), attachUserRole,  updateSupplier)

export default router;