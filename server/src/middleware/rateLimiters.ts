import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const tooManyRequests = {
  message: { message: "Too many requests. Please try again later." },
};

// Per-IP limiter for the auth endpoints. Each endpoint gets its own instance,
// so hitting one limit does not lock the client out of the others.
const createIpLimiter = (windowMs: number, max: number, options = {}) =>
  rateLimit({
    windowMs,
    max,
    ...tooManyRequests,
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });

// Creating accounts is expensive (bcrypt + an email send) and is the easiest
// way to fill the database or spam inboxes.
export const signupLimiter = createIpLimiter(ONE_HOUR, 5);

// Brute-force protection for passwords. Successful logins are not counted, so a
// legitimate user who logs in often is not locked out.
export const loginLimiter = createIpLimiter(FIFTEEN_MINUTES, 10, {
  skipSuccessfulRequests: true,
});

// Clicking the verification link is only useful once per token, but the limit
// stops token guessing and repeated abuse of the endpoint.
export const verifyEmailLimiter = createIpLimiter(FIFTEEN_MINUTES, 20);

// Keyed by the requested email, not the IP, so one attacker cannot flood a
// victim's inbox from many addresses. Falls back to the IP when no email is sent.
export const resendVerificationLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 3,
  ...tooManyRequests,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === "string" ? req.body.email : "";
    return email.trim().toLowerCase() || ipKeyGenerator(req.ip ?? "");
  },
});

// Without a rate limit, anyone could hit POST /api/auth/forgot-password thousands
// of times in a row, which opens the door to spam abuse, user enumeration and
// brute force.
export const forgotPasswordLimiter = createIpLimiter(FIFTEEN_MINUTES, 5);

// The reset token is 256 bits, so guessing is not practical, but limiting
// attempts is cheap defense in depth.
export const resetPasswordLimiter = createIpLimiter(FIFTEEN_MINUTES, 10);
