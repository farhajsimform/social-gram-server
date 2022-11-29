import express from "express";
const router = express.Router();
import { handleLogin, handleNewUser } from "../controller/auth";

const authRoutes = () => {
  router.post("/login", handleLogin);
  router.post("/register", handleNewUser);
  return router;
};

export default authRoutes;