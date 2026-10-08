import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { progressSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Autosaves the learner's code and hint usage for a lesson. */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { lessonId, code, hintsUsed, attempts, failed } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      ...(code !== undefined ? { code } : {}),
      ...(hintsUsed !== undefined ? { hintsUsed } : {}),
      ...(attempts !== undefined ? { attempts } : {}),
      ...(failed !== undefined ? { failed } : {}),
    },
    create: {
      userId,
      lessonId,
      code: code ?? null,
      hintsUsed: hintsUsed ?? 0,
      attempts: attempts ?? 0,
      failed: failed ?? false,
    },
  });

  return NextResponse.json({ ok: true });
}