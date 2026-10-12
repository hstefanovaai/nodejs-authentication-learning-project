import { Router } from "express";
import {
  postLogin,
  postSignup,
  getLogin,
  postLogout,
} from "../controllers/auth.js";

const router = Router();

router.post("/login", postLogin);

router.post("/signup", postSignup);

router.get("/login", getLogin);

router.post("/logout", postLogout);

export default router;
