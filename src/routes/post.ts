import { createPost, getAllPosts, handleReactions } from "../controller/post";
import { resizeImages, uploadImages } from "../middleware/uploadImage";
import { IRequest } from "../interfaces";
import express, { Response } from "express";

const router = express.Router();

const postRoutes = (io: any) => {
  router.post(
    "/post",
    uploadImages,
    resizeImages,
    (req: IRequest, res: Response) => createPost(req, res, io)
  );
  router.get("/post", getAllPosts);
  router.put("/reaction/:postId", handleReactions);
  router.put("/add-comment/:postId", handleReactions);
  return router;
};

export default postRoutes;
