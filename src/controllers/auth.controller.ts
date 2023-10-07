import { NextFunction, Request, Response } from "express";

import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { authService } from "../services/auth.service";
import { ITokenPayload, ITokensPair } from "../types/token.types";
import { IUser } from "../types/user.type";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const newUser: IUser = await authService.register(req.body);

      return res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const userTokens: ITokensPair = await authService.login(req.body);

      return res.status(201).json(userTokens);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const refreshToken = req.res.locals.refreshToken as string;

      const tokensPair = await authService.refresh(tokenPayload, refreshToken);

      return res.status(201).json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.res.locals.email;
      const user = await userRepository.getOneByParams({ email: userEmail });

      await tokenRepository.deleteOne({ _userId: user._id });

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
