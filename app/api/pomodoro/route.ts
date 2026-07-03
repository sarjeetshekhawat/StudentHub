import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PomodoroSession } from "@/models/PomodoroSession";
import { PomodoroSessionSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sessions = await PomodoroSession.find({ userId: session.user.id })
    .sort({ completedAt: -1 })
    .limit(50);
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = PomodoroSessionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const pomodoroSession = await PomodoroSession.create({
    userId: session.user.id,
    ...parsed.data,
    completedAt: new Date(),
  });
  return NextResponse.json(pomodoroSession, { status: 201 });
}
