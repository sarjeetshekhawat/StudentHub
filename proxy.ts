import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isApiDashboard = nextUrl.pathname.startsWith("/api/attendance") ||
    nextUrl.pathname.startsWith("/api/tasks") ||
    nextUrl.pathname.startsWith("/api/exams") ||
    nextUrl.pathname.startsWith("/api/pomodoro");

  if ((isDashboard || isApiDashboard) && !session) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/attendance/:path*", "/api/tasks/:path*", "/api/exams/:path*", "/api/pomodoro/:path*"],
};
