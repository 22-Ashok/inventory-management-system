import exprees from 'express';
import { setupPermanentPassword } from "../controllers/auth/setPermanentPassword";
import { login } from "../controllers/auth/login";
import { loginSchema, resetPasswordSchema} from "../schemas/userType";
import { validateData } from "../middleware/validateData";
import { forgotPassword } from '../controllers/auth/forgetPassword';
import { validateOTP } from '../controllers/auth/validateOTP';
import { resetPassword } from '../controllers/auth/resetPassword';
import { resetPasswordSchema2 } from '../schemas/resetPasswordSchema';

const authRouter = exprees.Router();

authRouter.post("/auth/login", validateData(loginSchema), login);
authRouter.post("/auth/set-permanent-password", validateData(resetPasswordSchema), setupPermanentPassword);
authRouter.post("/auth/request-password-forgot", forgotPassword);
authRouter.post("/auth/otp-validate",  validateOTP)
authRouter.post("/auth/reset-password", validateData(resetPasswordSchema2), resetPassword)

export default authRouter; 