import { Document, Types } from "mongoose";

import { IUser } from "./user.type";

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  userId: Types.ObjectId;
  name: string;
}
