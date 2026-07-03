"use client";

import { useState, useEffect, useCallback } from "react";
import { ISubject } from "@/models/Subject";

type SubjectWithId = ISubject & { _id: string };

function AttendanceBadge({ pct }: { pct: number }) {
  const color =
    pct >= 85 ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
    pct >= 75 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400" :
    "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>{pct}%</span>
  );
}

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<SubjectWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", totalClasses: "", attendedClasses: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSubjects = useCallback(async () => {
    const res = await fetch("/api/attendance");
    const data = await res.json();
    setSubjects(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", totalClasses: "", attendedClasses: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (sub: SubjectWithId) => {
    setEditId(sub._id);
    setForm({ name: sub.name, totalClasses: String(sub.totalClasses), attendedClasses: String(sub.attendedClasses) });
    setError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const body = {
      name: form.name,
      totalClasses: parseInt(form.totalClasses),
      attendedClasses: parseInt(form.attendedClasses),
    };

    const res = await fetch(editId ? `/api/attendance/${editId}` : "/api/attendance", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error?.formErrors?.[0] || "Failed to save");
    } else {
      setShowForm(false);
      fetchSubjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    await fetch(`/api/attendance/${id}`, { method: "DELETE" });
    fetchSubjects();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Attendance Tracker</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Monitor your subject-wise attendance</p>
        </div>
        <button
          id="add-subject-attendance-btn"
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl gradient-hero px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Subject
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl animate-slide-up">
            <h2 className="font-semibold mb-5">{editId ? "Edit Subject" : "Add Subject"}</h2>
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject Name</label>
                <input
                  id="subject-name-input"
                  placeholder="e.g. Mathematics"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Total Classes</label>
                  <input
                    id="total-classes-input"
                    type="number" min="0"
                    value={form.totalClasses}
                    onChange={(e) => setForm({ ...form, totalClasses: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Attended</label>
                  <input
                    id="attended-classes-input"
                    type="number" min="0"
                    value={form.attendedClasses}
                    onChange={(e) => setForm({ ...form, attendedClasses: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-[var(--color-muted)] transition-colors">Cancel</button>
              <button
                id="save-subject-btn"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl gradient-hero py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-20 rounded-2xl bg-[var(--color-muted)] animate-pulse" />)}
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] p-16 text-center">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="font-semibold mb-1">No subjects yet</h3>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Add your first subject to start tracking attendance</p>
          <button onClick={openAdd} className="rounded-xl gradient-hero px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">Add Subject</button>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map((sub) => {
            const pct = sub.totalClasses === 0 ? 0 : Math.round((sub.attendedClasses / sub.totalClasses) * 100);
            const canMiss = pct >= 75 ? Math.max(0, Math.floor(sub.attendedClasses / 0.75 - sub.totalClasses)) : 0;
            return (
              <div key={sub._id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">{sub.name}</h3>
                      <AttendanceBadge pct={pct} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)]">
                      <span>{sub.attendedClasses}/{sub.totalClasses} classes</span>
                      {pct >= 75 ? (
                        <span className="text-green-600 dark:text-green-400">Can miss {canMiss} more</span>
                      ) : (
                        <span className="text-red-500">⚠️ Below 75%</span>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 85 ? "bg-[var(--color-success)]" :
                          pct >= 75 ? "bg-[var(--color-warning)]" : "bg-[var(--color-danger)]"
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(sub)} className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors text-[var(--color-muted-foreground)]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(sub._id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors text-[var(--color-muted-foreground)] hover:text-red-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
