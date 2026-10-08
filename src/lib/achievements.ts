import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";

export type AchievementType =
  | "FIRST_COMPILE"
  | "FIRST_LESSON"
  | "PERFECT_LESSON"
  | "SEVEN_DAY_STREAK"
  | "POINTER_MASTER"
  | "TEN_LESSONS"
  | "CHAPTER_CLEAR";

export interface AchievementMeta {
  type: AchievementType;
  label: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementMeta[] = [
  {
    type: "FIRST_COMPILE",
    label: "First Compile",
    description: "Run your first piece of C++ code.",
    icon: "⚙️",
  },
  {
    type: "FIRST_LESSON",
    label: "Hello, World",
    description: "Complete your first lesson.",
    icon: "🌱",
  },
  {
    type: "PERFECT_LESSON",
    label: "No Hints Needed",
    description: "Complete a lesson without using any hints.",
    icon: "💎",
  },
  {
    type: "SEVEN_DAY_STREAK",
    label: "7-Day Streak",
    description: "Practice C++ seven days in a row.",
    icon: "🔥",
  },
  {
    type: "TEN_LESSONS",
    label: "Double Digits",
    description: "Complete ten lessons.",
    icon: "🏅",
  },
  {
    type: "POINTER_MASTER",
    label: "Pointer Master",
    description: "Finish a lesson in the Pointers & References chapter.",
    icon: "🎯",
  },
  {
    type: "CHAPTER_CLEAR",
    label: "Chapter Cleared",
    description: "Complete every lesson in a chapter.",
    icon: "📘",
  },
];

export const ACHIEVEMENT_MAP: Record<AchievementType, AchievementMeta> =
  ACHIEVEMENTS.reduce(
    (acc, meta) => {
      acc[meta.type] = meta;
      return acc;
    },
    {} as Record<AchievementType, AchievementMeta>
  );

export interface AchievementAward extends AchievementMeta {
  unlockedAt: Date;
}

/**
 * Recomputes every achievement for a user idempotently and returns the ones
 * that are newly unlocked in this call.
 */
export async function evaluateAchievements(
  prisma: PrismaClient,
  userId: string
): Promise<AchievementAward[]> {
  const [user, completed, submissions, existing, chapters] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProgress.findMany({
      where: { userId, completed: true },
      include: { lesson: { include: { chapter: true } } },
    }),
    prisma.submission.count({ where: { userId } }),
    prisma.achievement.findMany({ where: { userId } }),
    prisma.chapter.findMany({ include: { lessons: { select: { id: true } } } }),
  ]);

  if (!user) return [];

  const unlocked = new Set(existing.map((a) => a.type));
  const earned: AchievementType[] = [];

  if (submissions > 0) earned.push("FIRST_COMPILE");
  if (completed.length >= 1) earned.push("FIRST_LESSON");
  if (completed.length >= 10) earned.push("TEN_LESSONS");
  if (user.streak >= 7) earned.push("SEVEN_DAY_STREAK");

  const hasPerfect = completed.some((p) => p.hintsUsed === 0);
  if (hasPerfect) earned.push("PERFECT_LESSON");

  const hasPointer = completed.some(
    (p) => p.lesson.chapter.slug === "pointers-references"
  );
  if (hasPointer) earned.push("POINTER_MASTER");

  const completedIds = new Set(completed.map((p) => p.lessonId));
  const clearedChapter = chapters.some(
    (chapter) =>
      chapter.lessons.length > 0 &&
      chapter.lessons.every((lesson) => completedIds.has(lesson.id))
  );
  if (clearedChapter) earned.push("CHAPTER_CLEAR");

  const newTypes = earned.filter((type) => !unlocked.has(type));
  const awards: AchievementAward[] = [];

  for (const type of newTypes) {
    const created = await prisma.achievement.create({
      data: { userId, type },
    });
    awards.push({ ...ACHIEVEMENT_MAP[type], unlockedAt: created.unlockedAt });
  }

  return awards;
}