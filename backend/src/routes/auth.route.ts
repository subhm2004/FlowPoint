import { Router } from "express";
import {
  googleAuthController,
  googleCallbackController,
  logOutController,
  loginController,
  registerUserController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);

// Browser navigations, not XHR — these redirect rather than return JSON.
authRoutes.get("/google", googleAuthController);
authRoutes.get("/callback/google", googleCallbackController);

export default authRoutes;
