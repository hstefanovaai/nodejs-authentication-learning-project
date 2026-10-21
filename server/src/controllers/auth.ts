import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createVerificationToken, hashToken } from "../helpers/tokens.js";
import { authService } from "../services/auth.service.js";

import { NextFunction, Request, Response } from "express";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerifyEmail,
} from "../services/email.service.js";
import { Op } from "sequelize";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// What the signup endpoint does
// 1. Validates the request body.
// 2. Converts the email to lowercase and checks for an existing account.
// 3. Hashes the password using bcrypt.
// 4. Saves the new record through Sequelize.
// 5. Returns the public user details without the password hash.

// POST /api/auth/signup
export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const { token, tokenHash, expiresAt } = createVerificationToken();

    const user = await authService.signup(name, email, password);

    // 5.Send verify email
    try {
      await sendVerifyEmail(email, token);
    } catch (err) {
      console.error("Verify email failed", {
        userId: user.id,
        err,
      });

      next(err);
    }

    // 6. Returns the public user details without the password hash.
    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error)
  }
};

export const postVerifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const hashedToken = hashToken(token);

    if (typeof token !== "string" || !token) {
      return res
        .status(400)
        .json({ code: "INVALID_TOKEN", message: "Missing token." });
    }

    const user = await User.findOne({
      where: {
        emailVerificationTokenHash: hashedToken,
        emailVerificationExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        code: "INVALID_OR_EXPIRED_TOKEN",
        message: "This link is invalid or has expired.",
      });
    }

    // Single use: clear the token once it has been used
    await user.update({
      isEmailVerified: true,
      emailVerificationTokenHash: null,
      emailVerificationExpires: null,
    });

    res.json({ message: "Email verified." });
  } catch (err) {
    return res.status(500).json({ message: "Email was not verified." });
  }
};

export async function resendVerificationEmail(req: Request, res: Response) {
  const { email } = req.body;


  const user = await User.findOne({
    where: { email, isEmailVerified: false },
  });

  if (!user || user.isEmailVerified) return;

  const { token, tokenHash, expiresAt } = createVerificationToken();

  await user.update({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: expiresAt,
  });

  await sendVerifyEmail(user.email, token);

  return res.status(201).json({ message: "New verification email was sent." });
}

// POST /api/auth/login
//
// Regenerating the session = after registration or login, you replace the old session ID with a new one.Your application creates a new session ID after an important authentication-related action, so an attacker cannot reuse a session ID they forced or obtained before the user was authenticated.

// Session fixation = an attack that permits an attacker to hijack a valid user session. The attack explores a limitation in the way the web application manages the session ID, more specifically the vulnerable application's acceptance of session IDs from untrusted sources (such as the URL or a form parameter).

// What the login endpoint does
// 1. Finds the user by email.
// 2. Compares the supplied password with the saved hash.
// 3. Regenerates the session to prevent session fixation. -
// 4. Saves the user's ID in the session.
// 5. Returns the user details and sets the session cookie.

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email: email.trim().toLowerCase(), isEmailVerified: true },
    });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    req.session.regenerate((error: Error | null) => {
      if (error) {
        return res.status(500).json({
          message: "Could not start session.",
        });
      }

      req.session.userId = existingUser.id;
      req.session.save((saveError: Error | null) => {
        if (saveError) {
          return res.status(500).json({
            message: "Could not save session.",
          });
        }
      });

      return res.json({
        message: "Login successful.",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not logged in.",
      });
    }

    const user = await User.findByPk(userId);

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Session check error:", error);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const postLogout = (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      return res.status(500).json({
        message: "Could not destroy session.",
      });
    }

    res.clearCookie("app.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      message: "Logout successful.",
    });
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    await sendPasswordResetEmail(user.email, rawToken);

    res.status(200).json({
      message: "If that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password, confirmPassword } = req.body;

    if (!token || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    // in order to update the password the user should have matching hashed token that is not expired
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        email,
        resetToken: hashedToken,
        resetTokenExpiration: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    user.passwordHash = hashPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
