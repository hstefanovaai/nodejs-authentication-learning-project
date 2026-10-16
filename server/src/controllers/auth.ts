import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { sendWelcomeEmail } from "../services/email.service.js";

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
export const postSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validates the request body
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      name.trim().length > 100 ||
      password.length < 6 ||
      password.length > 128 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        message: "Please provide valid signup details.",
      });
    }

    // 2. Converts the email to lowercase and checks for an existing account.
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // 3. Hashes the password using bcrypt.
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Saves the new record through Sequelize.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // 5. send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (error) {
      console.error("Welcome email failed", {
        userId: user.id,
        error,
      });
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
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

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
      where: { email: email.trim().toLowerCase() },
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
