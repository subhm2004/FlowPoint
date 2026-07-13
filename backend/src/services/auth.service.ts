import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    // 3. Create a new workspace for the new user
    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

/**
 * Google sign-in. Three cases, in order:
 *  1. This Google account is already linked  -> log in.
 *  2. A user already exists with the same (Google-verified) email -> link Google to
 *     that user rather than forking a second account for the same person.
 *  3. Nobody matches -> create the user, workspace and OWNER membership, exactly as
 *     email registration does.
 */
export const loginOrCreateGoogleUserService = async ({
  googleId,
  email,
  name,
  profilePicture,
}: {
  googleId: string;
  email: string;
  name: string;
  profilePicture?: string | null;
}) => {
  const linkedAccount = await AccountModel.findOne({
    provider: ProviderEnum.GOOGLE,
    providerId: googleId,
  });

  if (linkedAccount) {
    const user = await UserModel.findById(linkedAccount.userId);
    if (!user) {
      throw new NotFoundException("User not found for the given account");
    }
    if (!user.isActive) {
      throw new UnauthorizedException("This account is disabled.");
    }
    if (!user.profilePicture && profilePicture) {
      user.profilePicture = profilePicture;
    }
    user.lastLogin = new Date();
    await user.save();
    return user.omitPassword();
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let user = await UserModel.findOne({ email }).session(session);

    if (user) {
      if (!user.isActive) {
        throw new UnauthorizedException("This account is disabled.");
      }
    } else {
      // No password: this user signs in through Google only.
      user = new UserModel({
        email,
        name,
        profilePicture: profilePicture ?? null,
      });
      await user.save({ session });

      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    }

    // providerId is Google's stable subject id, not the email — the unique index on
    // providerId is global, and the EMAIL account for this user already stores the email.
    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.GOOGLE,
      providerId: googleId,
    });
    await account.save({ session });

    if (!user.profilePicture && profilePicture) {
      user.profilePicture = profilePicture;
    }
    user.lastLogin = new Date();
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user.omitPassword();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user.omitPassword();
};
