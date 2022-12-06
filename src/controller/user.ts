import { Response } from "express";
import userModel from "../modals/user";
import { IRequest } from "../interfaces";
import friendsModel from "../modals/friends";
import mongoose from "mongoose";
import chatModel from "../modals/chats";
export const handleSendRequest = async (
  req: IRequest,
  res: Response,
  io: any
) => {
  try {
    const {
      tokenData: { id: senderId },
      params: { reciverId },
    } = req;
    if (reciverId === senderId) {
      return res
        .status(503)
        .json({ message: "You cant send friend request yourself" });
    }
    let { receivedRequests, sentRequests, friends } = await userModel
      .findById(senderId, {
        receivedRequests: 1,
        sentRequests: 1,
        friends: 1,
      })
      .populate({
        path: "friends",
      })
      .lean();
    receivedRequests = (receivedRequests || []).filter(
      (el) => el.toString() === reciverId.toString()
    );
    sentRequests = (sentRequests || []).filter(
      (el) => el.toString() === reciverId.toString()
    );
    friends = (friends || []).filter((ele: any) => {
      return ele.bothfriends.some(
        (elem: any) => elem.toString() === reciverId.toString()
      );
    });
    if (receivedRequests.length > 0) {
      return res
        .status(503)
        .json({ message: "This user already sent you a friend request" });
    } else if (sentRequests.length > 0) {
      return res
        .status(503)
        .json({ message: "You already sent friend request to this user" });
    } else if (friends.length > 0) {
      return res
        .status(503)
        .json({ message: "This user is already in your friend list" });
    } else {
      await userModel.updateOne(
        {
          _id: reciverId,
        },
        {
          $push: {
            receivedRequests: senderId,
          },
        }
      );
      await userModel.updateOne(
        {
          _id: senderId,
        },
        {
          $push: {
            sentRequests: reciverId,
          },
        }
      );
      res.status(200).json({ message: "Request sent successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleAcceptFriendRequest = async (
  req: IRequest,
  res: Response,
  io: any
) => {
  try {
    const {
      tokenData: { id: userid },
      params: { reciverId },
    } = req;
    const CreateFriends = await friendsModel.create({
      bothfriends: [userid, reciverId],
    });
    await userModel.updateOne(
      {
        _id: userid,
      },
      {
        $push: {
          friends: CreateFriends._id,
        },
        $pull: {
          receivedRequests: reciverId,
        },
      }
    );
    await userModel.updateOne(
      {
        _id: reciverId,
      },
      {
        $push: {
          friends: CreateFriends._id,
        },
        $pull: {
          sentRequests: userid,
        },
      }
    );

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleSearchProfiles = async (req: IRequest, res: Response) => {
  try {
    const {
      tokenData: { id: userid },
      query: { username, limit },
    } = req;
    const currentUserDetail = await userModel
      .findById(userid, {
        sentRequests: 1,
        receivedRequests: 1,
        friends: 1,
      })
      .populate({
        path: "friends",
        select: { password: 0 },
      })
      .lean();
    let profileList = await userModel
      .find(
        {
          $and: [
            {
              $or: [
                {
                  fullname: {
                    $regex: new RegExp(
                      "^" + String(username).toLowerCase(),
                      "i"
                    ),
                  },
                },
                {
                  email: {
                    $regex: new RegExp(
                      "^" + String(username).toLowerCase(),
                      "i"
                    ),
                  },
                },
              ],
            },
            {
              _id: {
                $ne: userid,
              },
            },
          ],
        },
        {
          fullname: 1,
          picture: 1,
          email: 1,
        }
      )
      .limit(Number(limit) || 50)
      .lean();
    const { sentRequests, receivedRequests, friends } = currentUserDetail || {};
    profileList.forEach((el: any) => {
      const alreadySent = (sentRequests || []).filter(
        (ele) => ele._id.toString() === el._id.toString()
      );
      const alreadyReceivedRequests = (receivedRequests || []).filter(
        (ele) => ele._id.toString() === el._id.toString()
      );
      const alreadyFriends = (friends || []).filter((ele: any) => {
        return ele.bothfriends.some(
          (elem: any) => elem.toString() === el._id.toString()
        );
      });
      if (alreadySent.length > 0) {
        el.requested = true;
        el.found = true;
      } else if (alreadyReceivedRequests.length > 0) {
        el.recived = true;
        el.found = true;
      } else if (alreadyFriends.length > 0) {
        el.friends = true;
        el.found = true;
      } else {
        el.found = false;
      }
    });
    res.status(200).json(profileList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleGetLoggedUserProfile = async (
  req: IRequest,
  res: Response
) => {
  try {
    const {
      tokenData: { id: userid },
    } = req;
    const userProfile = await userModel
      .findById(userid, {
        password: 0,
        passwordResetToken: 0,
        tokens: 0,
        passwordResetExpires: 0,
        roles: 0,
        posts: 0,
      })
      .populate({
        path: "sentRequests receivedRequests",
        select: {
          fullname: 1,
          picture: 1,
          email: 1,
        },
      })
      .populate({
        path: "friends",
        select: {
          bothfriends: 1,
          _id: 1,
        },
        options: {
          sort: {
            _id: -1,
          },
        },
        populate: {
          path: "bothfriends",
          select: {
            fullname: 1,
            picture: 1,
            email: 1,
          },
          match: {
            _id: {
              $ne: new mongoose.Types.ObjectId(userid),
            },
          },
        },
      })
      .lean();
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleDeclinedFriendRequest = async (
  req: IRequest,
  res: Response,
  io: any
) => {
  try {
    const {
      tokenData: { id: userid },
      params: { senderId },
    } = req;
    await userModel.updateOne(
      {
        _id: userid,
      },
      {
        $pull: {
          receivedRequests: new mongoose.Types.ObjectId(senderId),
        },
      }
    );
    await userModel.updateOne(
      {
        _id: senderId,
      },
      {
        $pull: {
          sentRequests: new mongoose.Types.ObjectId(userid),
        },
      }
    );
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleFetchUsersForChat = async (req: IRequest, res: Response) => {
  try {
    const {
      tokenData: { id: userid },
      // query: { limit },
    } = req;
    const allFriends = await friendsModel
      .find({ bothfriends: userid })
      .populate({
        path: "bothfriends",
        select: {
          fullname: 1,
          picture: 1,
          email: 1,
        },
        match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(userid),
          },
        },
      })
      .populate({
        path: "chats",
        options: {
          sort: {
            _id: -1,
          },
          skipLimit: 1,
        },
      })
      // .limit(Number(limit))
      .lean();
    res.status(200).json(allFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleGetRoomChats = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { roomID },
    } = req;
    const allChats = await chatModel.find({ roomID }).populate({
      path: "sendby",
      select: {
        fullname: 1,
        email: 1,
        picture: 1,
      },
    });
    res.status(200).json(allChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
