// If a particular endpoint requires authentication, add middleware that checks the session

import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

export const authorize = (...allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.session.userId) {
      res.status(401).json({
        error: "Authentication required.",
      });

      return;
    }

    try {
      // Read the role from the database, not the session. The session copy is
      // only set at login, so a promotion or demotion would not take effect
      // until the user logged in again.
      const user = await User.findByPk(req.session.userId, {
        attributes: ["id", "role"],
      });

      if (!user) {
        res.status(401).json({
          error: "Authentication required.",
        });

        return;
      }

      req.session.role = user.role;

      console.log("user role: ", user.role)

      if (!allowedRoles.includes(user.role)) {
        res
          .status(403)
          .json({ error: "You do not have permission to perform this action" });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
