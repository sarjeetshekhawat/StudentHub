"use client";

import { useState, useEffect, useCallback } from "react";
import { ITask } from "@/models/Task";

type TaskWithId = ITask & { _id: string };
type Filter = "all" | "pending" | "completed";

const priorityColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithId[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "medium" });
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const handleCreate = async () => {
    setSaving(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ title: "", description: "", dueDate: "", priority: "medium" });
    fetchTasks();
    setSaving(false);
  };

  const toggleComplete = async (task: TaskWithId) => {
    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Study Planner</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Organize your tasks and stay on track</p>
        </div>
        <button
          id="add-task-btn"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl gradient-hero px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
            }`}
          >
            {f} ({f === "all" ? tasks.length : f === "pending" ? tasks.filter((t) => !t.completed).length : tasks.filter((t) => t.completed).length})
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl animate-slide-up">
            <h2 className="font-semibold mb-5">New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title *</label>
                <input
                  id="task-title-input"
                  placeholder="What do you need to do?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional details…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-[var(--color-muted)]">Cancel</button>
              <button
                id="save-task-btn"
                onClick={handleCreate}
                disabled={!form.title.trim() || saving}
                className="flex-1 rounded-xl gradient-hero py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Adding…" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl bg-[var(--color-muted)] animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] p-16 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold mb-1">{filter === "completed" ? "No completed tasks yet" : "No tasks"}</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {filter === "all" ? "Create your first task to get started" : `No ${filter} tasks`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => (
            <div key={task._id} className={`flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-all ${task.completed ? "opacity-60" : ""}`}>
              <button
                onClick={() => toggleComplete(task)}
                className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                {task.completed && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium ${task.completed ? "line-through text-[var(--color-muted-foreground)]" : ""}`}>{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                </div>
                {task.description && <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">{task.description}</p>}
                {task.dueDate && (
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button onClick={() => handleDelete(task._id)} className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
