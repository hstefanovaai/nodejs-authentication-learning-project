import { Router } from "express";
import {
  postLogin,
  postSignup,
  getUser,
  postLogout,
} from "../controllers/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/login", postLogin);

router.post("/signup", postSignup);

router.get("/user", getUser);

router.post("/logout", postLogout);



export default router;
