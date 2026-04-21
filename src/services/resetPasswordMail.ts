import dotenv from "dotenv";
dotenv.config();
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../lib/sesClient";
import { ApiError } from "../utils/appError";

const buildOTPTemplate = (toEmail:string, otp:string, subject:string) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset the password for your account.</p>
            <p>Your 4-digit verification code is: <strong style="font-size: 1.2em; letter-spacing: 2px;">${otp}</strong></p>
            <p>This code is valid for the next <strong>5 minutes</strong>.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
            <p style="font-size: 0.9em; color: #666;"><em>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</em></p>
            `,
        },
      },
    },
    Source: process.env.Email as string, 
  });
};


export  const sendOTP = async (otp:string, toEmail:string) => {
   try {
      const subject = "Action Required: Your New Account Password";
        const command = buildOTPTemplate(toEmail, otp, subject);
        const response = await sesClient.send(command);
        console.log(`Successfully sent password to ${toEmail}`);
        return response;
   }

   catch(error){
        throw new ApiError(500, `Failed to send email: ${(error as Error).message}`);
   }
}