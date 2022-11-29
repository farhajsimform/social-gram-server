import { connect } from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await connect(String(process.env.DATABASE_URI));
    console.log('DB connected')
  } catch (err) {
    console.error(err);
  }
};
