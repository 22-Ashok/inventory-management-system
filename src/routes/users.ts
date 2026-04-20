import express from "express";
import { validateData } from "../middleware/validateData";
import { editUserByStaffSchema } from "../schemas/editUserSchema"
import { getStaff }  from  "../controllers/users/staff/getStaff"

const userRouter = express.Router();


userRouter.get("/users/me", validateData(editUserByStaffSchema), getStaff);
// userRouter.patch("/users/me")

export default userRouter;