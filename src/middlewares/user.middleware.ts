import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "../services/password.service";
import { IUser } from "../types/user.type";

class UserMiddleware {
  public async getByIdOrThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user: IUser = await userRepository.findById(userId);
      if (!user) {
        throw new ApiError("User not found", 404);
      }

      req.res.locals.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isEmailUniq(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user: IUser = await userRepository.getOneByParams({ email });
      if (user) {
        throw new ApiError("User with this email already exist!", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public async isEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user: IUser = await userRepository.getOneByParams({ email });
      if (!user) {
        throw new ApiError("User with this email does not exist!", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
