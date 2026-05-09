import { Router } from "express";
import {
  logOutController,
  loginController,
  registerUserController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);

export default authRoutes;
