import { body } from "express-validator";

const emailField = () =>
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail();

const tokenField = () =>
  body("token")
    .isString()
    .withMessage("Token is required")
    .notEmpty()
    .withMessage("Token is required");

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters"),

  emailField(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 72 })
    .withMessage("Password must be between 6 and 72 characters"),
];

export const loginValidation = [
  emailField(),

  body("password")
    .isString()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password is required"),
];

export const verifyEmailValidation = [tokenField()];

export const resendVerifyEmailValidation = [emailField()];

export const forgotPasswordValidation = [emailField()];

export const resetPasswordValidation = [
  tokenField(),

  emailField(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmPassword")
    .isString()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
