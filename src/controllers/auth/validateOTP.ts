import type { Request, Response, NextFunction } from "express";
import { redis } from "../../services/upStashRedis";
import { ApiError } from "../../utils/appError";
import crypto from "crypto";

export async function validateOTP(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, otp } = req.body;

        // 1. Increment attempt count
        const otpCount = await redis.incr(`otp_attempts:${email}`); 
        if(otpCount === 1) {
            await redis.expire(`otp_attempts:${email}`, 300);
        }

        // 2. FIX: Check rate limit BEFORE throwing the Invalid OTP error!
        if(otpCount > 5 ) {
            await redis.del(`reset_password_otp:${email}`); 
            await redis.del(`otp_attempts:${email}`);
            throw new ApiError(429, "Too many failed attempts. OTP has been invalidated. Please request a new one.");
        }

        // 3. Fetch stored OTP
        const storedOTP = await redis.get(`reset_password_otp:${email}`);
        
        if(!storedOTP) {
            throw new ApiError(400, "OTP has expired or is invalid. Please request a new one.");
        }

        // 4. FIX: Safely compare as Strings! 
        if(String(storedOTP) !== String(otp)) {
            throw new ApiError(400, "Invalid OTP. Please check the code and try again.");  
        }

        // ==========================================
        // SUCCESS PATH: The OTP is correct!
        // ==========================================

        // 5. Cleanup: Delete the old OTP and the attempt counter
        await redis.del(`reset_password_otp:${email}`);
        await redis.del(`otp_attempts:${email}`);

        // 6. Generate the secure Reset Token (The VIP Wristband)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 7. Store the Reset Token in a BRAND NEW Redis key for 15 minutes (900 seconds)
        const istokenSet = await redis.set(`password_reset_token:${email}`, resetToken, { ex: 900 });

        // 8. Send the token to the frontend so they can use it in the final step!
        return res.status(200).json({
            status: true,
            message: "OTP validated successfully. You can now reset your password.",
            data: { 
                resetToken // The frontend MUST save this and send it to the resetPassword route!
            },
            error: null
        });
    }

    catch(error) {
       next(error);
    }
}