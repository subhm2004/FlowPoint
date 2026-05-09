import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import { UnauthorizedException } from "../utils/appError";
import { verifyAccessToken } from "../utils/jwt";
import { asyncHandler } from "./asyncHandler.middleware";

const isAuthenticated = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;

    if (!token) {
      throw new UnauthorizedException("Unauthorized. Please log in.");
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(token);
      userId = payload.sub;
    } catch {
      throw new UnauthorizedException("Invalid or expired token.");
    }

    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Unauthorized. Please log in.");
    }

    req.user = user.omitPassword() as Express.User;
    next();
  }
);

export default isAuthenticated;
