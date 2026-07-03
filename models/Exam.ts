import mongoose, { Schema, models } from "mongoose";

export interface IExam {
  _id: string;
  userId: string;
  subject: string;
  examDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    examDate: { type: Date, required: true },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

export const Exam = models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
