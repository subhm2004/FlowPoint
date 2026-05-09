import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import {
  registerUserService,
  verifyUserService,
} from "../services/auth.service";
import UserModel from "../models/user.model";
import { signAccessToken } from "../utils/jwt";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const { userId } = await registerUserService(body);

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "User was created but could not be loaded.",
      });
    }

    const safeUser = user.omitPassword();
    const token = signAccessToken(String(safeUser._id));

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      token,
      user: safeUser,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await verifyUserService({ email, password });
    const token = signAccessToken(String(user._id));

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged in successfully",
      token,
      user,
    });
  }
);

export const logOutController = asyncHandler(
  async (_req: Request, res: Response) => {
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);
