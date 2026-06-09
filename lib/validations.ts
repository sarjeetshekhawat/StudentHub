import { z } from "zod";

// ─── Attendance ────────────────────────────────────────────────────────────────
export const SubjectSchema = z.object({
  name: z.string().min(1, "Subject name is required").max(100),
  totalClasses: z.number().int().min(0, "Must be ≥ 0"),
  attendedClasses: z.number().int().min(0, "Must be ≥ 0"),
}).refine((d) => d.attendedClasses <= d.totalClasses, {
  message: "Attended classes cannot exceed total classes",
  path: ["attendedClasses"],
});

export type SubjectInput = z.infer<typeof SubjectSchema>;

// ─── Task ──────────────────────────────────────────────────────────────────────
export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export type TaskInput = z.infer<typeof TaskSchema>;

// ─── Exam ──────────────────────────────────────────────────────────────────────
export const ExamSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(100),
  examDate: z.string().min(1, "Exam date is required"),
  notes: z.string().max(500).optional(),
});

export type ExamInput = z.infer<typeof ExamSchema>;

// ─── Pomodoro ─────────────────────────────────────────────────────────────────
export const PomodoroSessionSchema = z.object({
  duration: z.number().int().min(1).max(120),
  type: z.enum(["focus", "break"]),
});

export type PomodoroSessionInput = z.infer<typeof PomodoroSessionSchema>;
