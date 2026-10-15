import { Router } from "express";
import {
  postLogin,
  postSignup,
  getUser,
  postLogout,
} from "../controllers/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateCsrfToken } from "../middleware/csrf.js";

const router = Router();

// Issues a CSRF token and sets the matching CSRF cookie. The client calls this
// before performing any state-changing request and sends the returned token
// back in the `x-csrf-token` header.
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: generateCsrfToken(req, res) });
});

router.post("/login", postLogin);

router.post("/signup", postSignup);

router.get("/user", getUser);

router.post("/logout", postLogout);



export default router;
