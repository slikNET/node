import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { configs } from "../configs/config";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.servise";
import { ITokenPayload } from "../types/token.types";

class AuthMiddleware {
  // public checkAccessToken =
  //   (userId: string) =>
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const accessToken = req.get("Authorization");
  //
  //       if (!accessToken) {
  //         throw new ApiError("No Token!", 401);
  //       }
  //
  //       const payload = tokenService.checkToken(accessToken, "access");
  //
  //       const entity = await tokenRepository.findOne({ _userId: userId });
  //
  //       if (!entity) {
  //         throw new ApiError("Token not valid!", 401);
  //       }
  //
  //       req.res.locals.tokenPayload = payload;
  //       req.res.locals.accessToken = accessToken;
  //       next();
  //     } catch (e) {
  //       next(e);
  //     }
  //   };
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        throw new ApiError("No Token!", 401);
      }

      const payload = tokenService.checkToken(accessToken, "access");

      const entity = await tokenRepository.findOne({ accessToken });

      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.accessToken = accessToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        throw new ApiError("No Token!", 401);
      }

      const payload = tokenService.checkToken(refreshToken, "refresh");

      const entity = await tokenRepository.findOne({ refreshToken });

      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.get("Authorization");

      if (accessToken) {
        try {
          const payload = jwt.verify(
            accessToken,
            configs.JWT_ACCESS_SECRET,
          ) as ITokenPayload;
          // console.log(payload);
          const user = await tokenRepository.findOne({
            _userId: new mongoose.Types.ObjectId(payload.userId),
          });
          console.log(user);
          if (user) {
            throw new ApiError("You are already Logged In!", 401);
          }
          console.log(payload);
        } catch (e) {
          // throw new ApiError("You are already Logged In!", 401);
        }

        // jwt.verify(
        //   accessToken,
        //   configs.JWT_ACCESS_SECRET,
        //   function (err, decoded) {
        //     if (!err) {
        //       throw new ApiError("You are already Logged In!", 401);
        //     }
        //   },
        // );
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
