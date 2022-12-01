import { Types } from "mongoose";

export interface IPost {
  postedby: Types.ObjectId;
  comments: Array<Types.ObjectId>;
  likes: Array<Types.ObjectId>;
  cool: Array<Types.ObjectId>;
  funny: Array<Types.ObjectId>;
  wow: Array<Types.ObjectId>;
  angry: Array<Types.ObjectId>;
  tags: Array<Types.ObjectId>;
  content: string;
  images: Array<string>;
  hashtags: Array<string>;
  likesCount: number;
  coolCount: number;
  funnyCount: number;
  wowCount: number;
  angryCount: number;
}
