import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../lib/sesClient";
import dotenv from "dotenv";
dotenv.config();
import {ApiError} from "../utils/appError";

// FUNCTION 1: The Template Builder
// It only formats the data and returns the AWS Command object
const buildPasswordTemplate = (toEmail:string, tempPassword:string, subject:string) => {
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
            <h2>Welcome to the Team!</h2>
            <p>An admin has created an account for you.</p>
            <p>Your temporary password is: <strong>${tempPassword}</strong></p>
            <p>Please log in and you will be prompted to change it immediately.</p>
          `,
        },
      },
    },
    Source: process.env.Email as string, 
  });
};



// FUNCTION 2: The Main Function
// It takes the variables, calls the template builder, and sends the email
export const sendStaffPasswordEmail = async (toEmail:string, tempPassword:string) => {
  const subject = "Action Required: Your New Account Password";
  const command = buildPasswordTemplate(toEmail, tempPassword, subject);

  try {
    const response = await sesClient.send(command);
    console.log(`Successfully sent password to ${toEmail}`);
    return response;
  } catch (error) {
    throw new ApiError(500, `Failed to send email: ${(error as Error).message}`);
  }
};