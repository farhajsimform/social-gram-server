import { Types } from "mongoose";

export interface IFriends {
  chats: Array<Types.ObjectId>;
  bothfriends: Array<Types.ObjectId>;
}
