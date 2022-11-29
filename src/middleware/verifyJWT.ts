import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface IRequest extends Request {
  user: string;
  roles: Array<string>;
}

export const verifyJWT = (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!String(authHeader)?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = String(authHeader).split(" ")[1];
  console.log(token);
  jwt.verify(
    token,
    String(process.env.ACCESS_TOKEN_SECRET),
    (err: any, decoded: any) => {
      if (err) return res.sendStatus(403); //invalid token
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};
