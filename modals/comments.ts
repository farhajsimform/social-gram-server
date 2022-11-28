import { IComments } from 'interfaces';
import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema<IComments>(
  {
    commentby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    comment: {
      type: String,
      required: [true, 'please enter the text'],
    }
  },
  {
    timestamps: true,
  }
);
const commentModel = mongoose.model('comment', commentSchema);
export default commentModel;