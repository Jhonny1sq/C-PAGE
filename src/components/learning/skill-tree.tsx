"use client";

import Link from "next/link";
import {
  Check,
  ChevronRight,
  Circle,
  Lock,
  RotateCcw,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ChapterNode, LearningPath } from "@/lib/learning";

export function SkillTree({
  path,
  dueReviewIds,
}: {
  path: LearningPath;
  dueReviewIds: string[];
}) {
  const dueSet = new Set(dueReviewIds);
  const { totalLessons, completedLessons } = path.stats;
  const overall =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-200">Course progress</p>
            <p className="text-xs text-slate-400">
              {completedLessons} of {totalLessons} lessons complete
            </p>
          </div>
          <span className="text-2xl font-black text-emerald-400">{overall}%</span>
        </div>
        <Progress value={overall} className="mt-4" />
      </div>

      <ol className="space-y-5">
        {path.chapters.map((chapter, chapterIndex) => (
          <li key={chapter.id}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl text-xl",
                    chapter.locked
                      ? "bg-slate-800/70 grayscale"
                      : "bg-slate-800"
                  )}
                >
                  {chapter.icon ?? "📘"}
                </span>
                <div>
                  <h2 className="flex items-center gap-2 font-black text-slate-100">
                    {chapter.title}
                    {chapter.locked ? (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3" /> Locked
                      </Badge>
                    ) : null}
                  </h2>
                  <p className="max-w-md text-xs text-slate-400">
                    {chapter.description}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-400">
                {chapter.completedCount}/{chapter.total}
              </span>
            </div>

            <ChapterPath
              chapter={chapter}
              chapterIndex={chapterIndex}
              dueSet={dueSet}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChapterPath({
  chapter,
  chapterIndex,
  dueSet,
}: {
  chapter: ChapterNode;
  chapterIndex: number;
  dueSet: Set<string>;
}) {
  if (chapter.total === 0) {
    return (
      <div className="ml-5 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-5 py-4 text-sm text-slate-500">
        More lessons are on the way.
      </div>
    );
  }

  return (
    <ol className="ml-5 space-y-2 border-l-2 border-slate-800 pl-5">
      {chapter.lessons.map((lesson, i) => {
        const due = dueSet.has(lesson.id);
        const status = lesson.locked
          ? "locked"
          : lesson.completed
            ? "complete"
            : "current";

        const position = chapterIndex * 100 + i;

        return (
          <li key={lesson.id} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2",
                status === "complete" &&
                  "border-emerald-500 bg-emerald-500 text-slate-950",
                status === "current" &&
                  "border-emerald-400 bg-slate-950 text-emerald-400",
                status === "locked" && "border-slate-700 bg-slate-950 text-slate-600"
              )}
              style={{ animationDelay: `${position * 40}ms` }}
            >
              {status === "complete" ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : status === "locked" ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Circle className="h-2.5 w-2.5 fill-current" />
              )}
            </span>

            {lesson.locked ? (
              <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/30 px-4 py-3 text-sm text-slate-500">
                <span>{lesson.title}</span>
                <Lock className="h-4 w-4" />
              </div>
            ) : (
              <Link
                href={`/learn/${lesson.slug}`}
                className={cn(
                  "group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                  status === "complete"
                    ? "border-emerald-500/30 bg-emerald-500/5 text-slate-200 hover:border-emerald-500/60"
                    : "border-slate-700 bg-slate-900/80 text-slate-100 hover:border-emerald-400 hover:bg-slate-800",
                  status === "current" && "shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
                )}
              >
                <span className="flex items-center gap-2">
                  {lesson.title}
                  {due ? (
                    <Badge variant="warning">
                      <RotateCcw className="h-3 w-3" /> Review
                    </Badge>
                  ) : null}
                </span>
                <span className="flex items-center gap-2 text-slate-500">
                  {status === "complete" ? (
                    <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}