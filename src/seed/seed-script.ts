import { connection } from "mongoose";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import userModel from "../modals/user";
import chatModel from "../modals/chats";
import commentModel from "../modals/comments";
import postModel from "../modals/post";
import friendsModel from "../modals/friends";
import { connectDB } from "../config";

const seedDB = async (): Promise<void> => {
  if (process.env.ENVIRONMENT === "dev") {
    await connectDB();
    // Clear all data from database
    await chatModel.deleteMany({});
    await commentModel.deleteMany({});
    await postModel.deleteMany({});
    await friendsModel.deleteMany({});
    await userModel.deleteMany({});
    console.log("cleared all data");

    // Create users
    const hashedPwd = await bcrypt.hash("User@1234", 10);
    const seedUsers = [
      {
        email: "james.chris@yopmail.com",
        password: hashedPwd,
        username: "Chris james",
      },
      {
        email: "peter.james@yopmail.com",
        password: hashedPwd,
        username: "Peter james",
      },
      {
        email: "lawrence.candula@yopmail.com",
        password: hashedPwd,
        username: "Lawrence candula",
      },
    ];

    await userModel.insertMany(seedUsers);
    console.log("Users created");

    const seededUsers = await userModel.find();
    for (const user of seededUsers) {
      const createdPost = await postModel.create({
        content: faker.lorem.paragraphs(20),
        postedby: user._id,
      });
      await userModel.updateOne(
        { _id: user._id },
        {
          $push: {
            posts: createdPost._id,
          },
        }
      );
    }

    console.log("Post created successfully");
  }
};

seedDB().then(async () => {
  await connection.close();
  console.log("DB connection closed");
});
