import { Router } from "express";
import {
  postLogin,
  postSignup,
  getUser,
  postLogout,
  forgotPassword,
  resetPassword,
  postVerifyEmail,
  resendVerificationEmail
} from "../controllers/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateCsrfToken } from "../middleware/csrf.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Without a rate limit, anyone could hit your POST /api/auth/forgot-password endpoint thousands of times in a row. That opens the door to a few problems - spam abuse, user enumeration, brute force
// Rate limit the forgot-password endpoint to prevent abuse
// Max 5 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Issues a CSRF token and sets the matching CSRF cookie. The client calls this
// before performing any state-changing request and sends the returned token
// back in the `x-csrf-token` header.
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: generateCsrfToken(req, res) });
});

router.post("/login", postLogin);

router.post("/signup", postSignup);

router.get("/user", getUser);

router.post("/logout", postLogout);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/verify-email", postVerifyEmail)
router.post("/resend-verification", resendVerificationEmail)

export default router;
