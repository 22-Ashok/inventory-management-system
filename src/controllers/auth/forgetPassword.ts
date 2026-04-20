import type {Request, Response, NextFunction} from 'express'
import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/appError';
import {redis} from "../../services/upStashRedis";
import { sendOTP } from '../../services/resetPasswordMail';

export async function forgotPassword(req:Request, res:Response, next:NextFunction) {
   try{
       const {email} = req.body;

       // checks the email exsists or not
       const user = await prisma.user.findUnique({
        where: {email},
       })

       if(!user){
          throw new ApiError(404, "User with this email does not exist");
       }

       // generate the otp and send it to user email
       const otp = Math.floor(Math.random() * 10000);
       const redisKey : string = `reset_password_otp:${email}`;

       // save to cache and send it to the user email
       redis.set(redisKey, otp.toString(), {
        ex: 300, // expires in 5 minutes
       });

       // sending email
       sendOTP(otp.toString(), email);

       res.status(200).json({
         status:true,
         message:"OTP sent to your email",
         error:null
       })
   }

   catch(error){
      next(error);
   }
}