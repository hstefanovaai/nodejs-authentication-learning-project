import { requireAuth } from "../middleware/requireAuth.js";
import { Router } from "express";

const router = Router();

// Use requireAuth only on endpoints that genuinely need authentication.

router.get("/private", requireAuth, (req, res) => {
  res.json({ message: "Authenticated successfully." });
});

export default router;