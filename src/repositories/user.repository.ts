import { ObjectSchema } from "joi";

import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async findById(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async getIdByEmail(email: string) {
    return await User.exists({ email });
  }

  public async create(value: ObjectSchema): Promise<any> {
    //  TODO: тут не розібрався який тип має повертатись, тому написав any, хоча в IUser інтерфейсі створив додаткові поля, все одно вивидить помилку
    return await User.create(value);
  }

  public async deleteById(id: string) {
    const { deletedCount } = await User.deleteOne({ _id: id });

    return deletedCount;
  }

  public async updateById(id: string, value: IUser): Promise<any> {
    const updatedUser = await User.findByIdAndUpdate(id, value, {
      returnDocument: "after",
    });

    return updatedUser;
  }
}

export const userRepository = new UserRepository();
