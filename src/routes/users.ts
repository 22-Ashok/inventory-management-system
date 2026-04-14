import express from "express";
import { validateData } from "../middleware/validateData";
import {userSchema, loginSchema, passwordSchema} from "../schemas/userType";
import { createUser } from "../controllers/users/createUser";
import { setupPermanentPassword } from "../controllers/users/setPermanentPassword";
import { login } from "../controllers/users/login";
import { attachUserRole } from "../controllers/users/attachRole";

const userRouter = express.Router();

userRouter.post("/users", validateData(userSchema), attachUserRole, createUser);
userRouter.post("/auth/login", validateData(loginSchema), login)
userRouter.post("/auth/reset-password", validateData(passwordSchema), setupPermanentPassword);


export default userRouter;