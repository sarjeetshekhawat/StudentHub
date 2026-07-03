"use client";

import { useState } from "react";
import { AdBanner } from "@/components/ads/AdBanner";

interface Result {
  percentage: number;
  canMiss: number;
  needToAttend: number;
  status: "safe" | "warning" | "danger";
}

function calcAttendance(attended: number, total: number): Result {
  const percentage = total === 0 ? 0 : Math.round((attended / total) * 100 * 10) / 10;

  // How many more can be missed while staying ≥ 75%
  // (attended) / (total + x) >= 0.75 → never miss if already below
  let canMiss = 0;
  if (percentage >= 75) {
    // attended / (total + canMiss) >= 0.75
    // canMiss = (attended/0.75) - total  ... but total already includes attended
    // Correct: attended / (total + canMiss) >= 0.75
    // => canMiss <= attended/0.75 - total
    canMiss = Math.max(0, Math.floor(attended / 0.75 - total));
  }

  // How many more to attend to reach 75%
  // (attended + needToAttend) / (total + needToAttend) >= 0.75
  // 4*attended + 4*needToAttend >= 3*total + 3*needToAttend
  // needToAttend >= 3*total - 4*attended
  let needToAttend = 0;
  if (percentage < 75) {
    needToAttend = Math.max(0, Math.ceil(3 * total - 4 * attended));
  }

  const status = percentage >= 75 ? (percentage >= 85 ? "safe" : "warning") : "danger";
  return { percentage, canMiss, needToAttend, status };
}

export default function AttendanceCalculatorPage() {
  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const calculate = () => {
    const a = parseInt(attended);
    const t = parseInt(total);
    if (isNaN(a) || isNaN(t) || t <= 0 || a < 0 || a > t) return;
    setResult(calcAttendance(a, t));
  };

  const statusColors = {
    safe: "text-[var(--color-success)]",
    warning: "text-[var(--color-warning)]",
    danger: "text-[var(--color-danger)]",
  };

  const statusBg = {
    safe: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
    warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
    danger: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Ad: Above calculator */}
        <AdBanner position="top" className="mb-8" />

        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] mb-4">
            📊 Free Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">Attendance Calculator</h1>
          <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Calculate your attendance percentage instantly. Find out how many classes you can miss or need to attend to maintain 75%.
          </p>
        </div>

        {/* Calculator card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm p-8 animate-slide-up">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="attended-classes" className="block text-sm font-medium mb-2">
                Classes Attended
              </label>
              <input
                id="attended-classes"
                type="number"
                min="0"
                placeholder="e.g. 42"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="total-classes" className="block text-sm font-medium mb-2">
                Total Classes
              </label>
              <input
                id="total-classes"
                type="number"
                min="1"
                placeholder="e.g. 60"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-shadow"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            id="calculate-attendance-btn"
            className="mt-6 w-full rounded-xl gradient-hero py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-[0.99] transition-all"
          >
            Calculate Attendance
          </button>

          {/* Results */}
          {result && (
            <div className={`mt-6 rounded-xl border p-6 ${statusBg[result.status]} animate-slide-up`}>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold tabular-nums ${statusColors[result.status]}`}>
                  {result.percentage}%
                </div>
                <div className="mt-1 text-sm text-[var(--color-muted-foreground)]">Current attendance</div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-[var(--color-border)] rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.status === "safe" ? "bg-[var(--color-success)]" :
                    result.status === "warning" ? "bg-[var(--color-warning)]" : "bg-[var(--color-danger)]"
                  }`}
                  style={{ width: `${Math.min(result.percentage, 100)}%` }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[var(--color-card)]/80 p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{result.canMiss}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Classes you can miss</div>
                </div>
                <div className="rounded-xl bg-[var(--color-card)]/80 p-4 text-center">
                  <div className="text-2xl font-bold text-[var(--color-accent)]">{result.needToAttend}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Classes needed to reach 75%</div>
                </div>
              </div>

              <p className={`mt-4 text-center text-sm font-medium ${statusColors[result.status]}`}>
                {result.status === "safe" && "✅ Great! Your attendance is safe."}
                {result.status === "warning" && "⚠️ Be careful — you're close to the 75% limit."}
                {result.status === "danger" && "🚨 Your attendance is below 75%. Attend more classes!"}
              </p>
            </div>
          )}
        </div>

        {/* Ad: Below calculator */}
        <AdBanner position="bottom" className="mt-8" />

        {/* Info article */}
        <article className="mt-12 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">How Attendance Percentage Is Calculated</h2>
          <p className="text-[var(--color-muted-foreground)]">
            Attendance percentage = (Classes Attended ÷ Total Classes) × 100. Most universities require a minimum of 75% attendance to be eligible to appear in exams.
          </p>
          {/* Ad: Between article sections */}
          <AdBanner position="inline" className="my-6" />
          <h3 className="text-xl font-semibold mt-6 mb-2">Why 75% Is the Minimum</h3>
          <p className="text-[var(--color-muted-foreground)]">
            The 75% rule is a guideline to ensure students are engaged with their curriculum. Falling below this threshold may result in being debarred from exams.
          </p>
        </article>
      </div>
    </div>
  );
}
