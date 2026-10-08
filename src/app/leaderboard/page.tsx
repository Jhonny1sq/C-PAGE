import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Crown, Flame, Medal } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getWeeklyLeaderboard } from "@/lib/leaderboard";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leaderboard — C-PAGE" };

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/leaderboard");

  const board = await getWeeklyLeaderboard(user.id);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-300">
          <Crown className="h-3.5 w-3.5" /> Weekly XP
        </span>
        <h1 className="mt-4 text-2xl font-black text-slate-50 sm:text-3xl">
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Week of {new Date(board.weekStart).toLocaleDateString()}. Resets every
          Monday.
        </p>
      </div>

      {board.rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
          <p className="text-slate-400">
            No XP earned yet this week. Be the first on the board.
          </p>
        </div>
      ) : (
        <ol className="space-y-2">
          {board.rows.map((row) => (
            <li
              key={row.userId}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3",
                row.isCurrentUser
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-slate-800 bg-slate-900/50"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black",
                  row.rank === 1 && "bg-yellow-500/20 text-yellow-300",
                  row.rank === 2 && "bg-slate-400/20 text-slate-200",
                  row.rank === 3 && "bg-orange-600/20 text-orange-300",
                  row.rank > 3 && "text-slate-500"
                )}
              >
                {row.rank <= 3 ? <Medal className="h-4 w-4" /> : row.rank}
              </span>

              <Avatar
                src={row.avatarUrl}
                alt={row.username}
                fallback={row.username}
                className="h-9 w-9"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-100">
                  {row.username}
                  {row.isCurrentUser ? (
                    <span className="ml-2 text-xs font-semibold text-emerald-400">
                      you
                    </span>
                  ) : null}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Flame className="h-3 w-3 text-orange-400" /> {row.streak} day
                  streak
                </p>
              </div>

              <span className="shrink-0 font-black text-yellow-400">
                {row.weeklyXp}
                <span className="ml-1 text-xs font-semibold text-slate-500">
                  XP
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}