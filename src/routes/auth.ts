import exprees from 'express';
import { setupPermanentPassword } from "../controllers/auth/setPermanentPassword";
import { login } from "../controllers/auth/login";
import { loginSchema, resetPasswordSchema} from "../schemas/userType";
import { validateData } from "../middleware/validateData";

const authRouter = exprees.Router();

authRouter.post("/auth/login", validateData(loginSchema), login)
authRouter.post("/auth/reset-password", validateData(resetPasswordSchema), setupPermanentPassword);

export default authRouter; 