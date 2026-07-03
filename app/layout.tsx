import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "StudentHub – Your All-in-One Student Productivity Platform",
    template: "%s | StudentHub",
  },
  description:
    "Free student tools: GPA calculator, attendance tracker, Pomodoro timer, study planner, and exam countdown. Everything a student needs in one place.",
  keywords: ["student", "GPA calculator", "attendance calculator", "study planner", "Pomodoro timer", "CGPA calculator"],
  authors: [{ name: "StudentHub" }],
  openGraph: {
    title: "StudentHub – Student Productivity Platform",
    description: "Free GPA, attendance, and study tools for students",
    siteName: "StudentHub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentHub",
    description: "Free student productivity tools",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://studenthub.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
