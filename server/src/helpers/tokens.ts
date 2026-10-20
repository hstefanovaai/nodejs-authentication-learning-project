import crypto from "crypto";

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex"); // sent to the user, never stored

  return {
    token,
    tokenHash: hashToken(token), // stored in the DB
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  };
}
