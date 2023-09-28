import { ObjectSchema } from "joi";

import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class UserService {
  public async getAll(): Promise<IUser[]> {
    const users = await userRepository.getAll();

    return users;
  }

  public async create(value: ObjectSchema): Promise<IUser> {
    const user = await userRepository.create(value);

    return user;
  }

  public async deleteById(id: string): Promise<number> {
    const deletedCount = await userRepository.deleteById(id);

    return deletedCount;
  }

  public async updateById(id: string, value: IUser) {
    const updatedUser = await userRepository.updateById(id, value);

    return updatedUser;
  }
}

export const userService = new UserService();
