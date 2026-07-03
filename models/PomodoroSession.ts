import mongoose, { Schema, models } from "mongoose";

export interface IPomodoroSession {
  _id: string;
  userId: string;
  duration: number; // in minutes
  type: "focus" | "break";
  completedAt: Date;
  createdAt: Date;
}

const PomodoroSessionSchema = new Schema<IPomodoroSession>(
  {
    userId: { type: String, required: true, index: true },
    duration: { type: Number, required: true, min: 1, max: 120 },
    type: { type: String, enum: ["focus", "break"], required: true },
    completedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export const PomodoroSession =
  models.PomodoroSession ||
  mongoose.model<IPomodoroSession>("PomodoroSession", PomodoroSessionSchema);
