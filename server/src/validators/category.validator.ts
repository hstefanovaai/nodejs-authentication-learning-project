import { body } from "express-validator";
import Category from "../models/Category.js";

export const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters")
    .custom((value: string) => {
      return Category.findOne({ where: { name: value } }).then(() => {
        return Promise.reject("Category already exists");
      });
    }),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Name must be at most 100 characters"),
];
