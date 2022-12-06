import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../modals/user";

export const handleLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await userModel.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles: roles,
          id: foundUser._id
        },
      },
      String(process.env.ACCESS_TOKEN_SECRET),
      { expiresIn: "2d" }
    );
    const newRefreshToken = jwt.sign(
      { email: foundUser.email, id: foundUser._id },
      String(process.env.REFRESH_TOKEN_SECRET),
      { expiresIn: "10d" }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.tokens
      : foundUser.tokens.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const tokens = cookies.jwt;
      const foundToken = await userModel.findOne({ tokens }).lean();

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    // Saving refreshToken with current user
    foundUser.tokens = [...newRefreshTokenArray, newRefreshToken];
    await userModel.updateOne({ _id: foundUser._id }, foundUser);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ roles, accessToken, userid: foundUser._id });
  } else {
    res.sendStatus(401);
  }
};

export const handleNewUser = async (req: Request, res: Response) => {
  const { email, pwd, fullname } = req.body;
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check for duplicate usernames in the db
  const duplicate = await userModel.findOne({ email }).lean();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
   await userModel.create({
      email: email,
      password: hashedPwd,
      fullname
    });

    res.status(201).json({ success: `New user ${email} created!` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
