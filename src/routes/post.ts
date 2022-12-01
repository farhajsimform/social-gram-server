import { createPost, getAllPosts } from "../controller/post";
import { resizeImages, uploadImages } from "../middleware/uploadImage";
import express from "express";
const router = express.Router();

const postRoutes = () => {
  router.post("/post", uploadImages, resizeImages, createPost);
  router.get("/post", getAllPosts);
  return router;
};

export default postRoutes;
