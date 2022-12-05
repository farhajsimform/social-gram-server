import jwt from "jsonwebtoken";

export const getIdFromToken = (token: string) => {
const decoded = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET)) as any;
return decoded.UserInfo
};
