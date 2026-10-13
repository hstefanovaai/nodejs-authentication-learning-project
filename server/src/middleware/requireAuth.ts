// If a particular endpoint requires authentication, add middleware that checks the session

import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Please log in first.",
    });
  }

  next();
}
