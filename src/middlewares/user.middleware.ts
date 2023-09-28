import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { UserValidator } from "../validators/user.validator";

class UserMiddleware {
  public async getByIdOrThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await userRepository.findById(id);
      if (!user) {
        throw new ApiError("User not found", 404);
      }

      req.res.locals.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async ifExistedByEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;

      const existedUser = await userRepository.getIdByEmail(email);
      if (existedUser) {
        throw new ApiError(`User with email ${email} already exist`, 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public validDataOnCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UserValidator.create.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }

      req.res.locals.user = value;

      next();
    } catch (e) {
      next(e);
    }
  }

  public validDataOnUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UserValidator.update.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }

      req.res.locals.userData = value;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const userMiddleware = new UserMiddleware();
