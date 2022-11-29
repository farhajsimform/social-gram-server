import mongoose from "mongoose";
import { IUser } from '../interfaces';
import { regexForEmail } from "../constant";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      match: [regexForEmail, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },

    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    google: {
      type: String,
    },
    github: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    steam: {
      type: String,
    },
    tokens: [String],
    fullname: { type: String },
    gender: { type: String },
    geolocation: { type: String },
    website: { type: String },
    picture: { type: String },
    sentRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    receivedRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "friends",
      },
    ],
    roles: {
      User: {
          type: Number,
          default: 2001
      },
      Editor: Number,
      Admin: Number
  },
  },
  { timestamps: true }
);
userSchema.path("email").validate(async (email: string) => {
  const countUser = await mongoose.models.users.countDocuments({ email });
  return !countUser;
}, "This email already exist");

const userModel = mongoose.model("users", userSchema);
export default userModel;
