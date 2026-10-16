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
