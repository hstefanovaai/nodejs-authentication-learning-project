import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const users = await User.findAll({
    attributes: ["id", "email", "role", "createdAt"],
  });

  res.json(users);
};

// PATCH /api/users/:id/role
// Promotes a user to admin. Only reachable through authorize("admin").
// Returns only public fields, never the password hash.
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByPk(Number(req.params.id));

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (!["user", "admin"].includes(user.role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Also covers an admin targeting their own account, since the caller is
    // always an admin.
    if (user.role === "admin") {
      throw new AppError(409, "User is already an admin.");
    }

    await user.update({ role: "admin" });

    return res.json({
      message: "User promoted to admin.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
