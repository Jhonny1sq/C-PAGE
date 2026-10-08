import "server-only";
import { prisma } from "@/lib/prisma";

export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];

export interface SpacedRepetitionState {
  nextReviewAt: Date;
}

/**
 * Failures come back tomorrow; clean solves step further out. A simple
 * Leitner-style queue keyed on the previous review count.
 */
export function scheduleReview(
  failed: boolean,
  previousReviews = 0,
  now: Date = new Date()
): SpacedRepetitionState {
  const index = failed ? 0 : Math.min(previousReviews, REVIEW_INTERVALS_DAYS.length - 1);
  const days = REVIEW_INTERVALS_DAYS[index];
  const next = new Date(now);
  next.setUTCDate(next.getUTCDate() + days);
  return { nextReviewAt: next };
}

export interface LessonNode {
  id: string;
  slug: string;
  title: string;
  order: number;
  completed: boolean;
  failed: boolean;
  nextReviewAt: string | null;
  locked: boolean;
}

export interface ChapterNode {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  icon: string | null;
  locked: boolean;
  completedCount: number;
  total: number;
  lessons: LessonNode[];
}

export interface LearningPath {
  chapters: ChapterNode[];
  stats: {
    totalLessons: number;
    completedLessons: number;
    currentLessonId: string | null;
    dueReviewLessonIds: string[];
  };
}

/**
 * A lesson is unlocked when it is the first in its chapter or the previous
 * lesson in that chapter is complete. The first lesson of a chapter is
 * unlocked when the previous chapter has at least one completed lesson.
 */
export async function buildLearningPath(userId: string): Promise<LearningPath> {
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          progress: { where: { userId }, take: 1 },
        },
      },
    },
  });

  const now = new Date();
  let globalCompleted = 0;
  let currentLessonId: string | null = null;
  const dueReviewLessonIds: string[] = [];
  const result: ChapterNode[] = [];

  let chapterUnlocked = true;

  for (const chapter of chapters) {
    const lessonNodes: LessonNode[] = [];
    let previousLessonComplete = true;
    let chapterCompleted = 0;

    for (let i = 0; i < chapter.lessons.length; i++) {
      const lesson = chapter.lessons[i];
      const progress = lesson.progress[0];
      const completed = progress?.completed ?? false;
      const failed = progress?.failed ?? false;
      const nextReviewAt = progress?.nextReviewAt ?? null;

      const locked = !chapterUnlocked
        ? true
        : i === 0
          ? false
          : !previousLessonComplete;

      if (completed) {
        chapterCompleted += 1;
        globalCompleted += 1;
      }

      if (!completed && !locked && currentLessonId === null) {
        currentLessonId = lesson.id;
      }

      if (completed && nextReviewAt && nextReviewAt <= now) {
        dueReviewLessonIds.push(lesson.id);
      }

      lessonNodes.push({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        order: lesson.order,
        completed,
        failed,
        nextReviewAt: nextReviewAt ? nextReviewAt.toISOString() : null,
        locked,
      });

      previousLessonComplete = completed;
    }

    // Chapter N+1 unlocks once chapter N has at least one completed lesson.
    chapterUnlocked = chapterCompleted > 0;

    result.push({
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      description: chapter.description,
      order: chapter.order,
      icon: chapter.icon,
      locked: !chapterUnlocked,
      completedCount: chapterCompleted,
      total: chapter.lessons.length,
      lessons: lessonNodes,
    });
  }

  return {
    chapters: result,
    stats: {
      totalLessons: result.reduce((sum, c) => sum + c.total, 0),
      completedLessons: globalCompleted,
      currentLessonId,
      dueReviewLessonIds,
    },
  };
}