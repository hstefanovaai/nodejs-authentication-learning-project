import { body, param } from "express-validator";

export const updateUserRoleValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User id must be a positive integer"),

  // Only promotion to admin is supported. Demotion is out of scope for now.
  body("role").isIn(["admin"]).withMessage("Role must be 'admin'"),
];
