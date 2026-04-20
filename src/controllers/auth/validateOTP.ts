import type { Request, Response, NextFunction } from "express";
import { redis } from "../../services/upStashRedis";
import { ApiError } from "../../utils/appError";

export async function validateOTP(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, otp } = req.body;

        const otpCount = await redis.incr(`otp_attempts:${email}`); // Increment the attempt count

        if(otpCount === 1) {
            redis.expire(`otp_attempts:${email}`, 300);
        }

        // validate the otp that stored in the redis 
        const storedOTP = await redis.get(`reset_password_otp:${email}`);
        

        if(!storedOTP) {
            throw new ApiError(400, "OTP has expired or is invalid. Please request a new one.");
        }

        console.log("otp:", typeof otp);
        console.log("storedOTP:", typeof storedOTP);

        // if valid -> allow to reset the password
        if(storedOTP !== Number(otp)) {
            throw new ApiError(400, "Invalid OTP. Please check the code and try again.");   // required checks that user validate otp atmax - 5 times 
        }

        if(otpCount > 5 ) {
            await redis.del(`reset_password_otp:${email}`); // Invalidate the OTP after 5 failed attempts
            await redis.del(`otp_attempts:${email}`);
            throw new ApiError(429, "Too many failed attempts. OTP has been invalidated. Please request a new one.");
        }

        await redis.del(`otp_attempts:${email}`);

        // if valid -> allow to reset the password
        return res.status(200).json({
            status: true,
            message: "OTP validated successfully. You can now reset your password.",
            error: null
        });
    }

    catch(error) {
       next(error);
    }
}