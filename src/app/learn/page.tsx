import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Flame, Target, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { buildLearningPath } from "@/lib/learning";
import { SkillTree } from "@/components/learning/skill-tree";

export const metadata: Metadata = { title: "Learn — C-PAGE" };

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/learn");

  const path = await buildLearningPath(user.id);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-50 sm:text-3xl">
            Your learning path
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {path.stats.completedLessons === 0
              ? "Start at the top and work your way down."
              : "Pick up where you left off."}
          </p>
        </div>
        <div className="flex gap-2">
          <StatPill icon={<Flame className="h-4 w-4" />} value={user.streak} color="text-orange-400" label="day streak" />
          <StatPill icon={<Zap className="h-4 w-4" />} value={user.xp} color="text-yellow-400" label="total XP" />
        </div>
      </div>

      {path.stats.dueReviewLessonIds.length > 0 ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <Target className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-100">
            <span className="font-bold">
              {path.stats.dueReviewLessonIds.length}
            </span>{" "}
            lesson{path.stats.dueReviewLessonIds.length === 1 ? "" : "s"} due for
            review. Revisit to lock the concept in.
          </p>
        </div>
      ) : null}

      <SkillTree path={path} dueReviewIds={path.stats.dueReviewLessonIds} />
    </div>
  );
}

function StatPill({
  icon,
  value,
  color,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2">
      <span className={color}>{icon}</span>
      <span className="text-sm font-bold text-slate-100">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}