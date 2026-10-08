import "server-only";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS, type AchievementMeta } from "@/lib/achievements";

export interface ChapterStat {
  id: string;
  title: string;
  icon: string | null;
  completed: number;
  total: number;
  percent: number;
}

export interface AchievementView extends AchievementMeta {
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface Overview {
  chapterStats: ChapterStat[];
  weakest: ChapterStat[];
  achievements: AchievementView[];
  completedLessons: number;
  totalLessons: number;
  totalSubmissions: number;
  dueReviewCount: number;
}

export async function getOverview(userId: string): Promise<Overview> {
  const [chapters, completedProgress, unlockedAchievements, submissions, dueCount] =
    await Promise.all([
      prisma.chapter.findMany({
        where: { isSecret: false },
        orderBy: { order: "asc" },
        include: { lessons: { select: { id: true } } },
      }),
      prisma.userProgress.findMany({
        where: { userId, completed: true },
        select: { lessonId: true },
      }),
      prisma.achievement.findMany({ where: { userId } }),
      prisma.submission.count({ where: { userId } }),
      prisma.userProgress.count({
        where: {
          userId,
          completed: true,
          nextReviewAt: { lte: new Date() },
        },
      }),
    ]);

  const completedSet = new Set(completedProgress.map((p) => p.lessonId));

  const chapterStats: ChapterStat[] = chapters.map((chapter) => {
    const total = chapter.lessons.length;
    const completed = chapter.lessons.filter((l) =>
      completedSet.has(l.id)
    ).length;
    return {
      id: chapter.id,
      title: chapter.title,
      icon: chapter.icon,
      completed,
      total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });

  const weakest = chapterStats
    .filter((c) => c.total > 0 && c.percent < 100)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);

  const unlockedMap = new Map(
    unlockedAchievements.map((a) => [a.type, a.unlockedAt])
  );

  const achievements: AchievementView[] = ACHIEVEMENTS.map((meta) => ({
    ...meta,
    unlocked: unlockedMap.has(meta.type),
    unlockedAt: unlockedMap.get(meta.type)?.toISOString() ?? null,
  }));

  return {
    chapterStats,
    weakest,
    achievements,
    completedLessons: completedProgress.length,
    totalLessons: chapterStats.reduce((sum, c) => sum + c.total, 0),
    totalSubmissions: submissions,
    dueReviewCount: dueCount,
  };
}