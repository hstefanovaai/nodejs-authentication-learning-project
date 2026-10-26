import { requireAuth } from "../middleware/requireAuth.js";
import { authorize } from "../middleware/authorize.js";

import { Router } from "express";

const router = Router();

// Use requireAuth only on endpoints that genuinely need authentication.

router.get("/private", requireAuth, authorize("user"), (req, res) => {
  res.json({ message: "Authenticated successfully." });
});

export default router;
