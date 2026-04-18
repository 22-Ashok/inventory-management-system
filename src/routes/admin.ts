import express from 'express';
import { attachUserRole } from '../controllers/users/attachRole';
import  {getAllStaffSchema} from  "../schemas/getAllStaffQerrySchema"
import {validateData} from '../middleware/validateData';
import { getUsers } from '../controllers/users/admin/getUsers';
import { createUser } from '../controllers/users/admin/createUser';
import { createUserSchema } from '../schemas/userType';


const adminRouter = express.Router();

adminRouter.post("/admin/users", validateData(createUserSchema), attachUserRole, createUser)
//adminRouter.patch("/admin/users", )
//adminRouter.delete("/admin/users")
adminRouter.get("/admin/users", validateData(getAllStaffSchema), attachUserRole, getUsers)



export default adminRouter;
