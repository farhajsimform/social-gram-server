import { Request } from "express";
type TokenData = {
  user: string;
  roles: Array<string>;
  id: string;
};
export interface IRequest extends Request {
  tokenData: TokenData;
}
