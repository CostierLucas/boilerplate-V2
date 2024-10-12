import { z } from "zod";

const ResendErrorSchema = z.union([
  z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number(),
  }),
  z.object({
    name: z.literal("UnknownError"),
    message: z.literal("Unknown Error"),
    statusCode: z.literal(500),
    cause: z.any(),
  }),
]);

const ResendSuccessSchema = z.object({
  id: z.string(),
});

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(options: SendEmailOptions) {
  const from = "onboarding@resend.dev";
  const email = { from, ...options };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });

  const data = await response.json();
  const parsedData = ResendSuccessSchema.safeParse(data);

  if (response.ok && parsedData.success) {
    return { status: "success", data: parsedData } as const;
  } else {
    const parseResult = ResendErrorSchema.safeParse(data);
    if (parseResult.success) {
      console.error(parseResult.data);
      throw new Error("Unable to send email.");
    } else {
      console.error(data);
      throw new Error("Unable to send email.");
    }
  }
}

type AuthEmailOptions = {
  email: string;
  code: string;
  magicLink?: string | null;
};

export const sendAuthEmail = async ({
  email,
  code,
  magicLink,
}: AuthEmailOptions) => {
  const subject = "Your verification code for Remix Auth TOTP";
  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #fff; padding: 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 0; text-align: center;">
              <img src="https://your-logo-url.com" alt="Logo" width="150" style="max-width: 100%; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 20px;">
              <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Click to the button below to log in</h1>
              ${
                magicLink
                  ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${magicLink}" style="background-color: #007bff; border-radius: 4px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; text-align: center;">
                            Log In
                          </a>
                        </td>
                      </tr>
                    </table>
                  `
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f8f8; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px; padding: 20px 40px; text-align: center;">
              &copy; 2024 Your Company Name. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
};
