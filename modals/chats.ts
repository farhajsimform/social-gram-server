import { IChats } from 'interfaces';
import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema<IChats>(
  {
    sendby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    message: {
      type: String,
      required: [true, 'Message should be required'],
      minlength: [0, 'message should be greater than 0 characters'],
      maxlength: [100000, 'message should be less than 100000 characters'],
    },
    roomID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'friends',
    },
  },
  {
    timestamps: true,
  }
);
const chatModel = mongoose.model('chats', chatSchema);
export default chatModel;