import { Router } from "express";
import {
  postLogin,
  postSignup,
  getUser,
  postLogout,
  forgotPassword,
  resetPassword,
  postVerifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.js";
import { generateCsrfToken } from "../middleware/csrf.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resendVerifyEmailValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from "../validators/auth.validator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  forgotPasswordLimiter,
  loginLimiter,
  resendVerificationLimiter,
  resetPasswordLimiter,
  signupLimiter,
  verifyEmailLimiter,
} from "../middleware/rateLimiters.js";

const router = Router();

// Issues a CSRF token and sets the matching CSRF cookie. The client calls this
// before performing any state-changing request and sends the returned token
// back in the `x-csrf-token` header.

// /api/auth/csrf-token
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: generateCsrfToken(req, res) });
});

router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validateRequest,
  postLogin,
);

// the order is important:
// 1. registerValidation defines and executes the field checks.
// 2. validateRequest checks whether they passed.
// 3. postSignup runs only if the request is valid.
router.post(
  "/signup",
  // signupLimiter,
  registerValidation,
  validateRequest,
  postSignup,
);

router.get("/user", getUser);

router.post("/logout", postLogout);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordValidation,
  validateRequest,
  forgotPassword,
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  resetPasswordValidation,
  validateRequest,
  resetPassword,
);

router.post(
  "/verify-email",
  verifyEmailLimiter,
  verifyEmailValidation,
  validateRequest,
  postVerifyEmail,
);
router.post(
  "/resend-verification",
  resendVerificationLimiter,
  resendVerifyEmailValidation,
  validateRequest,
  resendVerificationEmail,
);

export default router;
