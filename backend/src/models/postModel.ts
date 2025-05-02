import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  summary: string;
  content: string;
  cover: string;
  author: Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);
export default Post;
