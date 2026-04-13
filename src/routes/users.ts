import express from "express";
import { validateData } from "../middleware/validateData";
import { loginSchema } from "../schemas/userType";

const router = express.Router();


router.get("/v1/auth/login", validateData(loginSchema), ) 

