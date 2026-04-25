import express from "express"
import { addCatogery } from "../controllers/catogery/addCatogery";
import { attachUserRole } from "../controllers/attachRole";
import * as schema from "../schemas/catogerySchema"
import { validateData } from "../middleware/validateData";
import { deleteCatogery } from "../controllers/catogery/deleteCatogery";
import { updateCatogery } from "../controllers/catogery/updateCatogery";
import { getAllCatogery } from "../controllers/catogery/getAllCatogery";


const router = express.Router();

router.post("/catogeries", validateData(schema.createCategorySchema), attachUserRole, addCatogery);
router.patch("/catogeries/:id", validateData(schema.updateCategorySchema),  attachUserRole, updateCatogery)
router.delete("/catogeries/:id", validateData(schema.deleteCategorySchema),  attachUserRole, deleteCatogery)
router.get("/catogeries", getAllCatogery);

export default router;