import express from "express";
import { validateData } from "../middleware/validateData";
import {userSchema} from "../schemas/userType";
import { createUser } from "../controllers/users/createUser";

const userRouter = express.Router();



userRouter.post("/users", validateData(userSchema), createUser)


export default userRouter;