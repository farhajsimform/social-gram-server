import { Types } from "mongoose";

export interface IChats {
    sendby: Types.ObjectId;
    roomID: Types.ObjectId;
    message: string;
}