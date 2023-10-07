import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";
import { passwordService } from "./password.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async deleteById(id: string): Promise<void> {
    await userRepository.deleteById(id);
  }

  public async updateById(userId: string, dto: Partial<IUser>) {
    const password = dto.password
      ? await passwordService.hash(dto.password)
      : dto.password;
    return await userRepository.updateById(userId, {
      ...dto,
      password,
    });
  }
}

export const userService = new UserService();
