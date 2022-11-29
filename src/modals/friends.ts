import { IFriends } from '../interfaces';
import mongoose from "mongoose";
const friendsSchema = new mongoose.Schema<IFriends>(
  {
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
      },
    ],
    bothfriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const friendsModel = mongoose.model("friends", friendsSchema);
export default friendsModel;
