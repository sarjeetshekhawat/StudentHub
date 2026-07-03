import Link from "next/link";
import Image from "next/image";

const tools = [
  { href: "/attendance-calculator", emoji: "📊", title: "Attendance Calculator", desc: "Know exactly how many classes you can skip or need to attend" },
  { href: "/gpa-calculator", emoji: "🎓", title: "GPA Calculator", desc: "Calculate semester GPA with unlimited subjects on a 4.0 scale" },
  { href: "/cgpa-calculator", emoji: "📈", title: "CGPA Calculator", desc: "Track your cumulative GPA across all semesters" },
  { href: "/percentage-calculator", emoji: "🔢", title: "Percentage Calculator", desc: "Convert marks to percentage and letter grade instantly" },
];

const features = [
  { emoji: "✅", title: "Attendance Tracker", desc: "Monitor subject-wise attendance and get alerts before falling below 75%" },
  { emoji: "📋", title: "Study Planner", desc: "Organize tasks with priorities, due dates, and completion tracking" },
  { emoji: "⏱️", title: "Pomodoro Timer", desc: "Boost focus with timed study sessions and break intervals" },
  { emoji: "📅", title: "Exam Countdown", desc: "Never miss an exam with countdown timers for every subject" },
];

export default function HomePage() {
  return (
    <div className="bg-[var(--color-background)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] mb-6 animate-fade-in">
            🚀 Built for students, by students
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Your All-in-One<br />
            <span className="text-gradient">Student Platform</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto mb-10 animate-slide-up">
            Free calculators, a powerful dashboard, and smart study tools — everything you need to ace your academics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/register"
              id="hero-get-started"
              className="rounded-xl gradient-hero px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Get started for free
            </Link>
            <Link
              href="/attendance-calculator"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-8 py-3.5 text-sm font-semibold hover:bg-[var(--color-muted)] transition-colors"
            >
              Try a calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator tools */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Free Student Calculators</h2>
          <p className="text-[var(--color-muted-foreground)]">No signup required. Use them right now.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{tool.emoji}</div>
              <h3 className="font-semibold mb-1.5 group-hover:text-[var(--color-primary)] transition-colors">{tool.title}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dashboard features */}
      <section className="bg-[var(--color-muted)]/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Powerful Student Dashboard</h2>
            <p className="text-[var(--color-muted-foreground)]">Sign in to unlock your personal study toolkit.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl gradient-hero px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Create free account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="StudentHub" width={28} height={28} className="rounded-lg" />
              <span className="font-bold text-gradient">StudentHub</span>
            </div>
            <div className="flex gap-6 text-sm text-[var(--color-muted-foreground)]">
              <Link href="/attendance-calculator" className="hover:text-[var(--color-foreground)] transition-colors">Attendance</Link>
              <Link href="/gpa-calculator" className="hover:text-[var(--color-foreground)] transition-colors">GPA</Link>
              <Link href="/blog" className="hover:text-[var(--color-foreground)] transition-colors">Blog</Link>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">© {new Date().getFullYear()} StudentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
