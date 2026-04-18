import express from "express";
import { validateData } from "../middleware/validateData";
import {createUserSchema, loginSchema, resetPasswordSchema} from "../schemas/userType";
import { createUser } from "../controllers/users/admin/createUser";
import { setupPermanentPassword } from "../controllers/auth/setPermanentPassword";
import { login } from "../controllers/auth/login";
import { attachUserRole } from "../controllers/users/attachRole";

const userRouter = express.Router();

userRouter.post("/users", validateData(createUserSchema), attachUserRole, createUser);
userRouter.post("/auth/login", validateData(loginSchema), login)
userRouter.post("/auth/reset-password", validateData(resetPasswordSchema), setupPermanentPassword);




export default userRouter;