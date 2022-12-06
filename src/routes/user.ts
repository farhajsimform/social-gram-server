import { IRequest } from "../interfaces";
import express, { Response } from "express";
import {
  handleAcceptFriendRequest,
  handleDeclinedFriendRequest,
  handleGetLoggedUserProfile,
  handleSearchProfiles,
  handleSendRequest,
  handleFetchUsersForChat,
  handleGetRoomChats
} from "../controller/user";

const router = express.Router();

const userRoutes = (io: any) => {
  router.patch(
    "/send-friend-request/:reciverId",
    (req: IRequest, res: Response) => handleSendRequest(req, res, io)
  );
  router.patch(
    "/accept-friend-request/:reciverId",
    (req: IRequest, res: Response) => handleAcceptFriendRequest(req, res, io)
  );
  router.patch(
    "/decline-friend-request/:senderId",
    (req: IRequest, res: Response) => handleDeclinedFriendRequest(req, res, io)
  );
  router.get("/search-profiles", handleSearchProfiles);
  router.get("/user-profile", handleGetLoggedUserProfile);
  router.get("/users-for-chat", handleFetchUsersForChat);
  router.get("/room-chat-data/:roomID", handleGetRoomChats);
  return router;
};

export default userRoutes;
