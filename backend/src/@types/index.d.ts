import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface User extends UserDocument {
      _id?: any;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: Express.User;
  }
}

export {};
