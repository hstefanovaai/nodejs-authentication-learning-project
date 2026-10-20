import { sendEmail } from "../providers/sendgrid.provider.js";

export async function sendWelcomeEmail(
  email: string,
  name: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Welcome to My App!",
    text: `Hi ${name}, welcome to My App! We're glad you're here.`,
    html: `
      <div>
        <h1>Welcome, ${escapeHtml(name)}!</h1>
        <p>Thanks for signing up for My App.</p>
        <p>We're glad you're here.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const resetLink = `${process.env.CLIENT_ORIGIN}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    to: email,
    subject: "Reset password",
    text: `You requested a password reset`,
    html: `
      <div>
        <p>This is the reset password <a href="${resetLink}">link </a>.</p>
      </div>
    `,
  });
}
export async function sendVerifyEmail(
  email: string,
  token: string,
): Promise<void> {
  const verifyEmailLink = `${process.env.CLIENT_ORIGIN}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    text: `New user`,
    html: `
      <div>
        <p>Verify your email address by clicking on this <a href="${verifyEmailLink}">link </a>.</p>
      </div>
    `,
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char] ?? char;
  });
}
