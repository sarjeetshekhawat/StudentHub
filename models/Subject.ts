import mongoose, { Schema, models } from "mongoose";

export interface ISubject {
  _id: string;
  userId: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    totalClasses: { type: Number, required: true, min: 0, default: 0 },
    attendedClasses: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

SubjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Subject = models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);
