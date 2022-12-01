import { Request, Response } from "express";
import mongoose from "mongoose";
import postModel from "..//modals/post";
import userModel from "../modals/user";
type TokenData = {
  user: string;
  roles: Array<string>;
  id: string;
};
interface IRequest extends Request {
  tokenData: TokenData;
}

export const createPost = async (req: IRequest, res: Response) => {
  try {
    const {
      body: { content, images },
      tokenData: { id },
    } = req;
    const createdPost = await postModel.create({
      content,
      images,
      postedby: id,
    });
    await userModel.updateOne(
      { _id: id },
      {
        $push: {
          posts: createdPost._id,
        },
      }
    );
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (_: Request, res: Response) => {
  try {
    const allPosts = await postModel
      .find()
      .populate({
        path: "postedby",
        select: {
          email: 1,
          picture: 1,
        },
      })
      .limit(100)
      .lean();

    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleReactions = async (req: IRequest, res: Response) => {
  try {
    const {
      tokenData: { id: userid },
      body: { reactionType, reactionCountType, postId },
    } = req;
    let id = new mongoose.Types.ObjectId(userid);
    let updateQuery = {};
    const findReactions = await postModel.findOne({
      $and: [{ _id: postId }, { [reactionType]: id }],
    });
    if (findReactions) {
      updateQuery = {
        $pull: {
          [reactionType]: id,
        },
        $inc: {
          [reactionCountType]: -1,
        },
      };
    } else {
      updateQuery = {
        $push: {
          [reactionType]: id,
        },
        $inc: {
          [reactionCountType]: 1,
        },
      };
    }
    await postModel.updateOne({ _id: postId }, updateQuery);
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
