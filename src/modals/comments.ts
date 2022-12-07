import { IComments } from "../interfaces";
import mongoose from "mongoose";
const commentSchema = new mongoose.Schema<IComments>(
  {
    commentby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    comment: {
      type: String,
      required: [true, "please enter the text"],
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId, // Will implement later thread chats
        ref: "comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);
function autoPopulateSubs(next: any) {
  this.populate("replies");
  next();
}
commentSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);
const commentModel = mongoose.model("comment", commentSchema);
export default commentModel;
