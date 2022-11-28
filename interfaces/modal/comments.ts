import { Types } from "mongoose";

export interface IComments {
  commentby: Types.ObjectId;
  comment: string;
}
