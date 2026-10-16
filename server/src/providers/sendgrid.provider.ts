

import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (!apiKey) {
  throw new Error("SENDGRID_API_KEY is not configured");
}

if (!fromEmail) {
  throw new Error("SENDGRID_FROM_EMAIL is not configured");
}

sgMail.setApiKey(apiKey);

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<void> {
  await sgMail.send({
    to,
    from: fromEmail!,
    subject,
    text,
    ...(html ? { html } : {}),
  });
}
