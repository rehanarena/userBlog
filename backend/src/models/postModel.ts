import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    summary: string;
    content: string;
    cover: string;
    createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>({
    title: {type: String },
    summary: { type: String },
    content: { type: String },
    cover: { type: String },
}, { timestamps: true });

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default Post;