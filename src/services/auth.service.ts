import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ITokenPayload, ITokensPair } from "../types/token.types";
import { IUser, IUserCredentials } from "../types/user.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.servise";

class AuthService {
  public async register(dto: IUserCredentials): Promise<IUser> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      return await userRepository.register({
        ...dto,
        password: hashedPassword,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(dto: IUserCredentials): Promise<ITokensPair> {
    try {
      const user: IUser = await userRepository.getOneByParams({
        email: dto.email,
      });

      const isMatched = await passwordService.compare(
        dto.password,
        user.password,
      );
      if (!isMatched) {
        throw new ApiError("Password does not match!", 401);
      }

      //  Delete old tokens first
      await tokenRepository.deleteOne({ _userId: user._id });
      //  Generate new tokens
      const tokenPair: ITokensPair = tokenService.generateTokenPair({
        userId: user._id,
        name: user.name,
      });
      //  Set new tokens into DB
      await tokenRepository.create({
        ...tokenPair,
        _userId: user._id,
      });

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokensPair> {
    try {
      const tokensPair = tokenService.generateTokenPair({
        userId: payload.userId,
        name: payload.name,
      });

      await Promise.all([
        tokenRepository.create({
          ...tokensPair,
          _userId: payload.userId,
        }),
        tokenRepository.deleteOne({ refreshToken }),
      ]);

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
