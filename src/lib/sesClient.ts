import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config()


export const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID as string,
  }
});
