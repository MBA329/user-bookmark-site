import express from "express";
import {
  login,
  logout,
  getMe,
  signUp,
 
} from "./auth.controller";
import { requireAuth } from "@/middleware/auth.middleware";

export const authRouter = express.Router();

authRouter.post("/login-session", login);
authRouter.post("/logout", requireAuth, logout);
authRouter.get("/me", requireAuth, getMe);
authRouter.post("/sign-up", signUp);
