import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../lib/sesClient"

const createSendEmailCommand = (toAddress: string, fromAddress : string) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>testing email</h1> <p> i am send this mail for testing mail purpose...</p>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "hii there",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: fromAddress,
  });
};


export const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "hop951801@gmail.com",
    "naviman0123@gmail.com",
  );

  try {
    console.log("sending email...")
    await sesClient.send(sendEmailCommand);
    console.log("email has been sent successfully");
  } catch (caught) {
    if (caught instanceof Error) {
      console.log("Error:", caught.message);
    }
  }
};


