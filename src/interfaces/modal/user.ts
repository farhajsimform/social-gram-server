import { Types, Document } from "mongoose";
export interface IRoles {
  User: number;
  Editor: number;
  Admin: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;

  facebook: string;
  twitter: string;
  google: string;
  github: string;
  instagram: string;
  linkedin: string;
  tokens: Array<string>;
  steam: string;

  fullname: string;
  gender: string;
  geolocation: string;
  website: string;
  picture: string;
  sentRequests: Array<Types.ObjectId>;
  receivedRequests: Array<Types.ObjectId>;
  friends: Array<Types.ObjectId>;
  posts: Array<Types.ObjectId>;
  roles: IRoles;
  online: boolean;
  username: string;
}

export default IUser;
