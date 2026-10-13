import { requireAuth } from "../middleware/requireAuth.js";
import { Router } from "express";

const router = Router();

router.get("/private", requireAuth, (req, res) => {
  res.json({ message: "Authenticated successfully." });
});

export default router;