import mongoose, { Schema, models } from "mongoose";

export interface ITask {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, maxlength: 1000 },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Task = models.Task || mongoose.model<ITask>("Task", TaskSchema);
