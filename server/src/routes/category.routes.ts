import { requireAuth } from "../middleware/requireAuth.js";
import { authorize } from "../middleware/authorize.js";
import {
  getAllCategories,
  getCategory,
  createCategory,
  getMainCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { Router } from "express";
import { categoryValidation } from "../validators/category.validator.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/main", getMainCategories);

router.get("/:slug", getCategory);
router.post(
  "/add",
  requireAuth,
  authorize("admin"),
  categoryValidation,
  createCategory,
);

router.patch(
  "/:id",
  requireAuth,
  authorize("admin"),
  categoryValidation,
  updateCategory,
);

router.delete("/:id", requireAuth, authorize("admin"), deleteCategory);
export default router;
