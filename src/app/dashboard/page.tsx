import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  BookOpen,
  Flame,
  Gem,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getOverview } from "@/lib/dashboard";
import { buildLearningPath } from "@/lib/learning";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResetProgressButton } from "@/components/dashboard/reset-progress-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard — C-PAGE" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const [overview, path] = await Promise.all([
    getOverview(user.id),
    buildLearningPath(user.id),
  ]);

  const overall =
    overview.totalLessons === 0
      ? 0
      : Math.round((overview.completedLessons / overview.totalLessons) * 100);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 sm:text-3xl">
            Hey, {user.username}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {overview.completedLessons} lessons down. Keep the streak warm.
          </p>
        </div>
        <Button asChild>
          <Link href="/learn">
            {path.stats.currentLessonId ? "Continue learning" : "Start learning"}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={`${user.streak} days`}
          color="text-orange-400"
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Total XP"
          value={user.xp}
          color="text-yellow-400"
        />
        <StatCard
          icon={<Gem className="h-5 w-5" />}
          label="Gems"
          value={user.gems}
          color="text-sky-400"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Completed"
          value={`${overview.completedLessons}/${overview.totalLessons}`}
          color="text-emerald-400"
        />
      </div>

      {overview.dueReviewCount > 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <Target className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-100">
            <span className="font-bold">{overview.dueReviewCount}</span> lesson
            {overview.dueReviewCount === 1 ? "" : "s"} are due for spaced
            repetition.{" "}
            <Link href="/learn" className="font-bold underline">
              Review now
            </Link>
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-400" /> Progress by chapter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                <span>Overall</span>
                <span>{overall}%</span>
              </div>
              <Progress value={overall} />
            </div>
            {overview.chapterStats.map((chapter) => (
              <div key={chapter.id}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>{chapter.icon ?? "📘"}</span>
                    {chapter.title}
                  </span>
                  <span className="text-slate-500">
                    {chapter.completed}/{chapter.total}
                  </span>
                </div>
                <Progress
                  value={chapter.percent}
                  indicatorClassName={cn(
                    chapter.percent === 100
                      ? "bg-emerald-500"
                      : chapter.percent === 0
                        ? "bg-slate-700"
                        : "bg-emerald-400"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-rose-400" /> Weakest topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.weakest.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Nothing weak yet. Everything you&apos;ve reached is done.
                </p>
              ) : (
                overview.weakest.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                  >
                    <span className="text-sm text-slate-200">
                      {chapter.icon} {chapter.title}
                    </span>
                    <Badge variant="danger">{chapter.percent}%</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-4 w-4 text-yellow-400" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {overview.achievements.map((achievement) => (
                <div
                  key={achievement.type}
                  title={achievement.description}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs",
                    achievement.unlocked
                      ? "border-yellow-500/30 bg-yellow-500/5 text-slate-200"
                      : "border-slate-800 bg-slate-950/40 text-slate-600"
                  )}
                >
                  <span className={cn(achievement.unlocked ? "" : "grayscale opacity-50")}>
                    {achievement.icon}
                  </span>
                  <span className="truncate font-semibold">
                    {achievement.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <div>
          <p className="text-sm font-bold text-slate-200">Danger zone</p>
          <p className="text-xs text-slate-500">
            Reset all progress, XP, streaks, and badges. This cannot be undone.
          </p>
        </div>
        <ResetProgressButton />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <span className={color}>{icon}</span>
      <p className="mt-2 text-xl font-black text-slate-50">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}