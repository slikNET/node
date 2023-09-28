import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();

      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.res.locals;

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.res.locals;

      const createdUser = await userService.create(user);

      res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await userService.deleteById(id);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { userData: value } = req.res.locals;

      const updatedUser = await userService.updateById(id, value);

      res.status(201).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
