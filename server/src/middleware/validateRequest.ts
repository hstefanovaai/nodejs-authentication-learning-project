
import type { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validateRequest: RequestHandler = (
  req,
  res,
  next
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : "request",
        message: error.msg,
      })),
    });
    return;
  }

  next();
};
