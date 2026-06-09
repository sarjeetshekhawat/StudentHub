import mongoose, { Schema, models } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    emailVerified: { type: Date },
    password: { type: String, select: false },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
