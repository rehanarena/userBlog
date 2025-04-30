import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    name: {type: String, required: true, min: 4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;