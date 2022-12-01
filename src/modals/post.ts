import { IPost } from "../interfaces";
import mongoose from "mongoose";
const postSchema = new mongoose.Schema<IPost>(
  {
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    cool: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    funny: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    wow: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    angry: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    content: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    hashtags: [
      {
        type: String,
      },
    ],
    likesCount: {
      type: Number,
    },
    coolCount: {
      type: Number,
    },
    funnyCount: {
      type: Number,
    },
    wowCount: {
      type: Number,
    },
    angryCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const postModel = mongoose.model("posts", postSchema);
export default postModel;
