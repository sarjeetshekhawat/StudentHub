"use client";

import { useState, useEffect, useCallback } from "react";
import { IExam } from "@/models/Exam";

type ExamWithId = IExam & { _id: string };

function getDaysLeft(date: Date): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", examDate: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchExams = useCallback(async () => {
    const res = await fetch("/api/exams");
    setExams(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const handleCreate = async () => {
    setSaving(true);
    await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ subject: "", examDate: "", notes: "" });
    fetchExams();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/exams/${id}`, { method: "DELETE" });
    fetchExams();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Exam Countdown</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Never miss an exam again</p>
        </div>
        <button
          id="add-exam-btn"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl gradient-hero px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Exam
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl animate-slide-up">
            <h2 className="font-semibold mb-5">Add Exam</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject *</label>
                <input
                  id="exam-subject-input"
                  placeholder="e.g. Data Structures"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Exam Date *</label>
                <input
                  id="exam-date-input"
                  type="date"
                  value={form.examDate}
                  onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-[var(--color-muted)]">Cancel</button>
              <button
                id="save-exam-btn"
                onClick={handleCreate}
                disabled={!form.subject.trim() || !form.examDate || saving}
                className="flex-1 rounded-xl gradient-hero py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Adding…" : "Add Exam"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exams grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => <div key={i} className="h-32 rounded-2xl bg-[var(--color-muted)] animate-pulse" />)}
        </div>
      ) : exams.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] p-16 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-semibold mb-1">No exams scheduled</h3>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Add your upcoming exams to track countdowns</p>
          <button onClick={() => setShowForm(true)} className="rounded-xl gradient-hero px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Add Exam</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const daysLeft = getDaysLeft(exam.examDate);
            const isUrgent = daysLeft <= 3;
            const isSoon = daysLeft <= 7;
            return (
              <div key={exam._id} className={`rounded-2xl border p-5 relative ${
                isUrgent ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20" :
                isSoon ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/20" :
                "border-[var(--color-border)] bg-[var(--color-card)]"
              }`}>
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div className={`text-4xl font-bold tabular-nums mb-1 ${
                  isUrgent ? "text-red-600 dark:text-red-400" :
                  isSoon ? "text-yellow-600 dark:text-yellow-400" :
                  "text-[var(--color-primary)]"
                }`}>
                  {daysLeft <= 0 ? "Today!" : `${daysLeft}d`}
                </div>
                <div className="text-xs text-[var(--color-muted-foreground)] mb-2">days remaining</div>
                <div className="font-semibold pr-8">{exam.subject}</div>
                <div className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {new Date(exam.examDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
                </div>
                {exam.notes && <p className="text-xs text-[var(--color-muted-foreground)] mt-2 italic">{exam.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
