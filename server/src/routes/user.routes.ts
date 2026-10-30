import { Router } from "express";
import { updateUserRole, getAllUsers } from "../controllers/user.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateUserRoleValidation } from "../validators/user.validator.js";

const router = Router();

router.get("/", requireAuth, authorize("admin"), getAllUsers);
// Order matters: authenticate, then check the role, then validate the input.
// PATCH /api/users/:id/role — promote a user to admin.
router.patch(
  "/:id/role",
  requireAuth,
  authorize("admin"),
  updateUserRoleValidation,
  validateRequest,
  updateUserRole,
);

export default router;
