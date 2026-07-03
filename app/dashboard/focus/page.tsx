"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Mode = "focus" | "break";

const PRESETS = {
  focus: [15, 25, 30, 45, 60],
  break: [5, 10, 15],
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function FocusPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [sessionLog, setSessionLog] = useState<{ type: Mode; duration: number; time: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDuration = mode === "focus" ? focusDuration : breakDuration;

  const resetTimer = useCallback((newMode?: Mode, newDuration?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    const m = newMode ?? mode;
    const d = newDuration ?? (m === "focus" ? focusDuration : breakDuration);
    setTimeLeft(d * 60);
  }, [mode, focusDuration, breakDuration]);

  // Sync timeLeft when duration changes (and timer not running)
  useEffect(() => {
    if (!running) {
      setTimeLeft(currentDuration * 60);
    }
  }, [currentDuration, running]);

  const saveSession = useCallback(async (completedMode: Mode, duration: number) => {
    await fetch("/api/pomodoro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: completedMode, duration }),
    });
    setSessionsToday((p) => p + 1);
    setSessionLog((prev) => [
      { type: completedMode, duration, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          saveSession(mode, currentDuration);
          // Auto-switch
          const nextMode: Mode = mode === "focus" ? "break" : "focus";
          setMode(nextMode);
          return (nextMode === "focus" ? focusDuration : breakDuration) * 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const progress = 1 - timeLeft / (currentDuration * 60);
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Focus Timer</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">Stay productive with timed sessions</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-8 bg-[var(--color-muted)] rounded-xl p-1">
        {(["focus", "break"] as Mode[]).map((m) => (
          <button
            key={m}
            id={`timer-mode-${m}`}
            onClick={() => { setMode(m); resetTimer(m); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
              mode === m
                ? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]"
                : "text-[var(--color-muted-foreground)]"
            }`}
          >
            {m === "focus" ? "🎯 Focus" : "☕ Break"}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="110" fill="none" stroke="var(--color-border)" strokeWidth="12" />
            <circle
              cx="120" cy="120" r="110"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(55% 0.22 260)" />
                <stop offset="100%" stopColor="oklch(70% 0.2 170)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold tabular-nums">
              {pad(Math.floor(timeLeft / 60))}:{pad(timeLeft % 60)}
            </div>
            <div className="text-sm text-[var(--color-muted-foreground)] mt-1 capitalize">{mode}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => resetTimer()}
            className="p-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors text-[var(--color-muted-foreground)]"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            id={running ? "pause-timer-btn" : "start-timer-btn"}
            onClick={running ? pause : start}
            className="px-12 py-3 rounded-xl gradient-hero text-white font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
          >
            {running ? "Pause" : "Start"}
          </button>
        </div>
      </div>

      {/* Duration presets */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 mb-6">
        <h3 className="font-semibold mb-3 text-sm">{mode === "focus" ? "Focus" : "Break"} Duration</h3>
        <div className="flex gap-2 flex-wrap">
          {PRESETS[mode].map((d) => (
            <button
              key={d}
              onClick={() => {
                if (mode === "focus") setFocusDuration(d);
                else setBreakDuration(d);
                if (!running) setTimeLeft(d * 60);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentDuration === d
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* Stats & session log */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-center">
          <div className="text-3xl font-bold text-[var(--color-primary)]">{sessionsToday}</div>
          <div className="text-sm text-[var(--color-muted-foreground)] mt-1">Sessions this session</div>
        </div>
        {sessionLog.length > 0 && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <h3 className="font-semibold text-sm mb-3">Recent Sessions</h3>
            <div className="space-y-1.5">
              {sessionLog.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className={s.type === "focus" ? "text-[var(--color-primary)]" : "text-[var(--color-accent)]"}>
                    {s.type === "focus" ? "🎯" : "☕"} {s.type} · {s.duration}m
                  </span>
                  <span className="text-[var(--color-muted-foreground)]">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
