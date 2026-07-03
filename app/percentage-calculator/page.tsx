"use client";

import { useState } from "react";
import { AdBanner } from "@/components/ads/AdBanner";

function getGrade(pct: number): { letter: string; color: string } {
  if (pct >= 90) return { letter: "A+", color: "text-[var(--color-success)]" };
  if (pct >= 80) return { letter: "A", color: "text-[var(--color-success)]" };
  if (pct >= 70) return { letter: "B", color: "text-[var(--color-accent)]" };
  if (pct >= 60) return { letter: "C", color: "text-[var(--color-warning)]" };
  if (pct >= 50) return { letter: "D", color: "text-[var(--color-warning)]" };
  return { letter: "F", color: "text-[var(--color-danger)]" };
}

export default function PercentageCalculatorPage() {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");

  const pct =
    total && obtained && parseFloat(total) > 0
      ? Math.round((parseFloat(obtained) / parseFloat(total)) * 1000) / 10
      : null;

  const grade = pct !== null ? getGrade(pct) : null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <AdBanner position="top" className="mb-8" />

        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] mb-4">
            🔢 Free Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">Percentage Calculator</h1>
          <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Convert marks to percentage instantly. Enter your obtained marks and total marks to see your percentage and grade.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm p-8 animate-slide-up">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="marks-obtained" className="block text-sm font-medium mb-2">
                Marks Obtained
              </label>
              <input
                id="marks-obtained"
                type="number"
                min="0"
                placeholder="e.g. 85"
                value={obtained}
                onChange={(e) => setObtained(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="total-marks" className="block text-sm font-medium mb-2">
                Total Marks
              </label>
              <input
                id="total-marks"
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-shadow"
              />
            </div>
          </div>

          {pct !== null && grade && (
            <div className="mt-8 rounded-xl bg-[var(--color-muted)]/50 border border-[var(--color-border)] p-6 text-center animate-slide-up">
              <div className={`text-7xl font-bold tabular-nums ${grade.color}`}>{pct}%</div>
              <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                Grade: <span className={`text-xl font-bold ${grade.color}`}>{grade.letter}</span>
              </div>
              <div className="mt-4 w-full h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 gradient-hero"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
                {obtained} out of {total} marks
              </p>
            </div>
          )}
        </div>

        {/* Grading table */}
        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border)]">
            <h2 className="font-semibold">Grading Scale Reference</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {[
              { range: "90–100%", grade: "A+", desc: "Outstanding" },
              { range: "80–89%", grade: "A", desc: "Excellent" },
              { range: "70–79%", grade: "B", desc: "Good" },
              { range: "60–69%", grade: "C", desc: "Average" },
              { range: "50–59%", grade: "D", desc: "Below Average" },
              { range: "Below 50%", grade: "F", desc: "Fail" },
            ].map(({ range, grade: g, desc }) => (
              <div key={g} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-[var(--color-muted-foreground)]">{range}</span>
                <span className="font-semibold w-8 text-center">{g}</span>
                <span className="text-[var(--color-muted-foreground)]">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <AdBanner position="bottom" className="mt-8" />
      </div>
    </div>
  );
}
