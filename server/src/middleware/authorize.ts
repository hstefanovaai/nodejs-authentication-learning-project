// If a particular endpoint requires authentication, add middleware that checks the session

import { Request, Response, NextFunction } from "express";

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session.userId) {
      res.status(401).json({
        error: "Authentication required.",
      });

      return;
    }

    if (!allowedRoles.includes(req.session.role!)) {
      res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
      return;
    }

    next();
  };
};
