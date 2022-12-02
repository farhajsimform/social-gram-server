import { Request, Response } from "express";
import mongoose from "mongoose";
import postModel from "..//modals/post";
import userModel from "../modals/user";
import { IRequest } from "../interfaces";
import commentModel from "../modals/comments";

export const createPost = async (req: IRequest, res: Response, io: any) => {
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
    const userPost = await postModel
      .findById(createdPost._id)
      .populate({
        path: "postedby",
        select: {
          email: 1,
          picture: 1,
          fullname: 1,
        },
      })
      .lean();
    io.emit("GetNewPosts", userPost);
    res.status(201).json(userPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const allPosts = await postModel
      .find()
      .populate({
        path: "postedby",
        select: {
          email: 1,
          picture: 1,
          fullname: 1,
        },
      })
      .populate({
        path: "comments",
        select: { comment: 1, createdAt: 1, commentby: 1 },
        populate: {
          path: "commentby",
          select: {
            _id: 1,
            fullname: 1,
            picture: 1,
            email: 1,
          },
        },
      })
      .limit(Number(limit || 5))
      .sort({ _id: -1 })
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
      body: { reactionType, reactionCountType },
      params: { postId },
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

export const handleComment = async (req: IRequest, res: Response) => {
  try {
    const {
      body: { comment },
      tokenData: { id: userid },
      params: { postId },
    } = req;
    const createComment = await commentModel.create({
      comment,
      commnetedby: userid,
    });
    await postModel.updateOne(
      { _id: postId },
      {
        $push: {
          comments: createComment._id,
        },
      }
    );
    if (createComment) {
      const getCommentData = await commentModel
        .findById(
          { _id: createComment._id },
          { _id: 0, comment: 1, date: 1, commnetedby: 1 }
        )
        .populate({
          path: "commnetedby",
          select: {
            _id: 0,
            username: 1,
            useravatar: 1,
          },
        });
      res.status(200).json(getCommentData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
