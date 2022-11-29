import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import { connectDB, corsOptions } from "./config";
import { logger } from "./middleware/logEvents";
import { credentials } from "./middleware/credentials";
import authRoutes, {} from './routes/auth'
import { verifyJWT } from "./middleware/verifyJWT";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

// Database connection
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions as any));

//middleware for cookies
app.use(cookieParser());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/auth', authRoutes());
app.use(verifyJWT as any);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
