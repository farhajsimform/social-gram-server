import { Request } from "express";
export type TokenData = {
  user: string;
  roles: Array<string>;
  id: string;
};
export interface IRequest extends Request {
  tokenData: TokenData;
}
