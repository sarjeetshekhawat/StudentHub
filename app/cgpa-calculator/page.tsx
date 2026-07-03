"use client";

import { useState } from "react";
import { AdBanner } from "@/components/ads/AdBanner";

interface Semester {
  id: string;
  label: string;
  gpa: number;
  credits: number;
}

function calcCGPA(semesters: Semester[]): number {
  const valid = semesters.filter((s) => s.credits > 0 && s.gpa >= 0);
  if (valid.length === 0) return 0;
  const totalCredits = valid.reduce((sum, s) => sum + s.credits, 0);
  const weighted = valid.reduce((sum, s) => sum + s.gpa * s.credits, 0);
  return Math.round((weighted / totalCredits) * 100) / 100;
}

export default function CGPACalculatorPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: "1", label: "Semester 1", gpa: 3.5, credits: 18 },
    { id: "2", label: "Semester 2", gpa: 3.2, credits: 20 },
  ]);

  const cgpa = calcCGPA(semesters);
  const totalCredits = semesters.reduce((s, sem) => s + sem.credits, 0);

  const cgpaColor =
    cgpa >= 3.5 ? "text-[var(--color-success)]" :
    cgpa >= 2.5 ? "text-[var(--color-warning)]" :
    "text-[var(--color-danger)]";

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <AdBanner position="top" className="mb-8" />

        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] mb-4">
            📈 Free Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">CGPA Calculator</h1>
          <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Calculate your Cumulative GPA across all semesters. Add semester GPAs and credit hours for accurate results.
          </p>
        </div>

        {/* CGPA display */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 mb-6 text-center shadow-sm animate-slide-up">
          <div className={`text-6xl font-bold tabular-nums ${cgpaColor}`}>{cgpa.toFixed(2)}</div>
          <div className="text-[var(--color-muted-foreground)] text-sm mt-1">
            Cumulative GPA · <span className="font-medium text-[var(--color-foreground)]">{totalCredits} total credits</span>
          </div>
          <div className="mt-4 w-full h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 gradient-hero"
              style={{ width: `${(cgpa / 4.0) * 100}%` }}
            />
          </div>
        </div>

        {/* Semesters */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm overflow-hidden animate-slide-up">
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-semibold">Semesters</h2>
            <button
              id="add-semester-btn"
              onClick={() => setSemesters((prev) => [
                ...prev,
                { id: Date.now().toString(), label: `Semester ${prev.length + 1}`, gpa: 3.0, credits: 18 }
              ])}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Semester
            </button>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {semesters.map((sem, idx) => (
              <div key={sem.id} className="p-4 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <input
                    value={sem.label}
                    onChange={(e) => setSemesters((prev) => prev.map((s) => s.id === sem.id ? { ...s, label: e.target.value } : s))}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    placeholder={`Semester ${idx + 1}`}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0"
                    max="4.0"
                    step="0.01"
                    placeholder="GPA"
                    value={sem.gpa}
                    onChange={(e) => setSemesters((prev) => prev.map((s) => s.id === sem.id ? { ...s, gpa: parseFloat(e.target.value) || 0 } : s))}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    min="1"
                    placeholder="Credits"
                    value={sem.credits}
                    onChange={(e) => setSemesters((prev) => prev.map((s) => s.id === sem.id ? { ...s, credits: parseInt(e.target.value) || 0 } : s))}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => setSemesters((prev) => prev.filter((s) => s.id !== sem.id))}
                    disabled={semesters.length <= 1}
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
