import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { completeSchema } from "@/lib/validation";
import { calculateXp, advanceStreak } from "@/lib/gamification";
import { evaluateAchievements } from "@/lib/achievements";
import { scheduleReview } from "@/lib/learning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Marks a lesson complete, awards XP, advances the streak, and re-checks badges. */
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

  const parsed = completeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { lessonId, code, hintsUsed, attempts } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, xpReward: true, chapter: { select: { isSecret: true } } },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  if (lesson.chapter.isSecret) {
    const { hasVaultAccess } = await import("@/lib/vault");
    if (!(await hasVaultAccess(userId))) {
      return NextResponse.json({ error: "The vault is locked." }, { status: 403 });
    }
  }

  const existing = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
    select: { completed: true, attempts: true },
  });

  const totalAttempts = Math.max(attempts, (existing?.attempts ?? 0) + 1);
  const alreadyCompleted = existing?.completed ?? false;

  const xp =
    alreadyCompleted
      ? { base: lesson.xpReward, hintPenalty: 0, attemptPenalty: 0, perfectBonus: 0, total: 0 }
      : calculateXp(lesson.xpReward, hintsUsed, totalAttempts);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastActiveAt: true, gems: true, xp: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const now = new Date();
  const { streak } = advanceStreak({
    currentStreak: user.streak,
    lastActiveAt: user.lastActiveAt,
    now,
  });

  const review = scheduleReview(false, totalAttempts - 1, now);

  await prisma.$transaction([
    prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        completed: true,
        failed: false,
        hintsUsed,
        attempts: totalAttempts,
        ...(code !== undefined ? { code } : {}),
        ...(alreadyCompleted ? {} : { xpEarned: xp.total }),
        completedAt: existing?.completed ? undefined : now,
        nextReviewAt: review.nextReviewAt,
      },
      create: {
        userId,
        lessonId,
        code: code ?? null,
        completed: true,
        hintsUsed,
        attempts: totalAttempts,
        xpEarned: xp.total,
        completedAt: now,
        nextReviewAt: review.nextReviewAt,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xp.total },
        ...(alreadyCompleted ? {} : { gems: { increment: 5 } }),
        streak,
        lastActiveAt: now,
      },
    }),
    prisma.streak.upsert({
      where: { userId_date: { userId, date: dayStart(now) } },
      update: { active: true },
      create: { userId, date: dayStart(now), active: true },
    }),
  ]);

  const achievements = await evaluateAchievements(prisma, userId);

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, streak: true, gems: true },
  });

  return NextResponse.json({
    ok: true,
    xp: xp.total,
    xpBreakdown: xp,
    alreadyCompleted,
    streak: updated?.streak ?? streak,
    totalXp: updated?.xp ?? user.xp,
    nextReviewAt: review.nextReviewAt.toISOString(),
    achievements,
  });
}

function dayStart(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}