import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async (): Promise<void> => {
  try {
    await connect(String(process.env.DATABASE_URI));
    console.log("DB connected");
  } catch (err) {
    console.error(err);
  }
};
