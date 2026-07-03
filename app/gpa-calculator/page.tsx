"use client";

import { useState } from "react";
import { AdBanner } from "@/components/ads/AdBanner";

type Grade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F";

const gradePoints: Record<Grade, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D": 1.0, "F": 0.0,
};

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: Grade;
}

function calcGPA(subjects: Subject[]): number {
  const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
  if (totalCredits === 0) return 0;
  const weightedPoints = subjects.reduce((s, sub) => s + sub.credits * gradePoints[sub.grade], 0);
  return Math.round((weightedPoints / totalCredits) * 100) / 100;
}

export default function GPACalculatorPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", credits: 3, grade: "A" },
    { id: "2", name: "", credits: 3, grade: "B+" },
  ]);

  const gpa = calcGPA(subjects.filter((s) => s.credits > 0));

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", credits: 3, grade: "A" },
    ]);
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const gpaColor =
    gpa >= 3.5 ? "text-[var(--color-success)]" :
    gpa >= 2.5 ? "text-[var(--color-warning)]" :
    "text-[var(--color-danger)]";

  const letterGrade =
    gpa >= 3.7 ? "A+" : gpa >= 3.3 ? "A" : gpa >= 3.0 ? "A-" :
    gpa >= 2.7 ? "B+" : gpa >= 2.3 ? "B" : gpa >= 2.0 ? "B-" :
    gpa >= 1.7 ? "C+" : gpa >= 1.0 ? "C" : "F";

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <AdBanner position="top" className="mb-8" />

        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] mb-4">
            🎓 Free Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">GPA Calculator</h1>
          <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Add your subjects, credits, and grades to calculate your GPA instantly. Supports 4.0 scale.
          </p>
        </div>

        {/* Live GPA display */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 mb-6 text-center shadow-sm animate-slide-up">
          <div className={`text-6xl font-bold tabular-nums ${gpaColor}`}>{gpa.toFixed(2)}</div>
          <div className="text-[var(--color-muted-foreground)] text-sm mt-1">GPA · Letter Grade: <span className="font-semibold text-[var(--color-foreground)]">{letterGrade}</span></div>
          <div className="mt-4 w-full h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 gradient-hero"
              style={{ width: `${(gpa / 4.0) * 100}%` }}
            />
          </div>
        </div>

        {/* Subjects table */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm overflow-hidden animate-slide-up">
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-semibold">Subjects</h2>
            <button
              onClick={addSubject}
              id="add-subject-btn"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Subject
            </button>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {subjects.map((subject, idx) => (
              <div key={subject.id} className="p-4 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    placeholder={`Subject ${idx + 1}`}
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0.5"
                    max="6"
                    step="0.5"
                    placeholder="Credits"
                    value={subject.credits}
                    onChange={(e) => updateSubject(subject.id, "credits", parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={subject.grade}
                    onChange={(e) => updateSubject(subject.id, "grade", e.target.value as Grade)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  >
                    {Object.keys(gradePoints).map((g) => (
                      <option key={g} value={g}>{g} ({gradePoints[g as Grade].toFixed(1)})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeSubject(subject.id)}
                    disabled={subjects.length <= 1}
                    className="p-1 rounded text-[var(--color-muted-foreground)] hover:text-[var(--color-danger)] disabled:opacity-30 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdBanner position="bottom" className="mt-8" />
      </div>
    </div>
  );
}
