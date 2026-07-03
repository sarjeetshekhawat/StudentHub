import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Subject } from "@/models/Subject";
import { Task } from "@/models/Task";
import { Exam } from "@/models/Exam";
import { PomodoroSession } from "@/models/PomodoroSession";
import Link from "next/link";

async function getDashboardStats(userId: string) {
  await connectDB();

  const [subjects, tasks, exams, pomodoroSessions] = await Promise.all([
    Subject.find({ userId }),
    Task.find({ userId }),
    Exam.find({ userId, examDate: { $gte: new Date() } }).sort({ examDate: 1 }).limit(3),
    PomodoroSession.countDocuments({ userId, type: "focus" }),
  ]);

  const totalAttendance =
    subjects.length === 0
      ? 0
      : Math.round(
          (subjects.reduce((s, sub) => s + sub.attendedClasses, 0) /
            subjects.reduce((s, sub) => s + sub.totalClasses, 0)) *
            100
        );

  const tasksDueToday = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  }).length;

  return { subjects, tasks, exams, pomodoroSessions, totalAttendance, tasksDueToday };
}

function OverviewCard({
  emoji, title, value, subtitle, href, color,
}: {
  emoji: string; title: string; value: string | number;
  subtitle: string; href: string;
  color: "primary" | "success" | "warning" | "accent";
}) {
  const colorMap = {
    primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    success: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    accent: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  };

  return (
    <Link href={href} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 hover:shadow-md transition-all">
      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl text-2xl mb-4 ${colorMap[color]}`}>
        {emoji}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="font-medium mb-0.5">{title}</div>
      <div className="text-sm text-[var(--color-muted-foreground)]">{subtitle}</div>
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id || "";
  const { subjects, tasks, exams, pomodoroSessions, totalAttendance, tasksDueToday } =
    await getDashboardStats(userId);

  const pendingTasks = tasks.filter((t) => !t.completed).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Good {getGreeting()}, {session?.user?.name?.split(" ")[0] || "Student"}! 👋</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">Here&apos;s your academic overview for today.</p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <OverviewCard
          emoji="📊"
          title="Avg. Attendance"
          value={`${totalAttendance}%`}
          subtitle={`${subjects.length} subjects tracked`}
          href="/dashboard/attendance"
          color={totalAttendance >= 75 ? "success" : "warning"}
        />
        <OverviewCard
          emoji="📅"
          title="Upcoming Exams"
          value={exams.length}
          subtitle={exams[0] ? `Next: ${exams[0].subject}` : "No exams scheduled"}
          href="/dashboard/exams"
          color="primary"
        />
        <OverviewCard
          emoji="✅"
          title="Tasks Due Today"
          value={tasksDueToday}
          subtitle={`${pendingTasks} total pending`}
          href="/dashboard/tasks"
          color="warning"
        />
        <OverviewCard
          emoji="⏱️"
          title="Focus Sessions"
          value={pomodoroSessions}
          subtitle="Total completed"
          href="/dashboard/focus"
          color="accent"
        />
      </div>

      {/* Upcoming exams */}
      {exams.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 mb-6">
          <h2 className="font-semibold mb-4">Upcoming Exams</h2>
          <div className="space-y-3">
            {exams.map((exam) => {
              const daysLeft = Math.ceil(
                (new Date(exam.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div key={exam._id.toString()} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <div>
                    <div className="font-medium text-sm">{exam.subject}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)]">
                      {new Date(exam.examDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    daysLeft <= 3 ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400" :
                    daysLeft <= 7 ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400" :
                    "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  }`}>
                    {daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/attendance-calculator", label: "Attendance Calculator", icon: "📊" },
          { href: "/gpa-calculator", label: "GPA Calculator", icon: "🎓" },
          { href: "/cgpa-calculator", label: "CGPA Calculator", icon: "📈" },
          { href: "/percentage-calculator", label: "Percentage Calculator", icon: "🔢" },
        ].map((l) => (
          <Link key={l.href} href={l.href}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm font-medium hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-muted)]/50 transition-all"
          >
            <span>{l.icon}</span> {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
