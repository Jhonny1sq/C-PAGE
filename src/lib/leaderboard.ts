import "server-only";
import { prisma } from "@/lib/prisma";

export interface LeaderboardRow {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  weeklyXp: number;
  streak: number;
  isCurrentUser: boolean;
}

export interface Leaderboard {
  rows: LeaderboardRow[];
  weekStart: string;
  currentUserRank: number | null;
}

export function startOfUtcWeek(now: Date = new Date()): Date {
  const day = now.getUTCDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // days since Monday
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  monday.setUTCDate(monday.getUTCDate() - diff);
  return monday;
}

export async function getWeeklyLeaderboard(
  currentUserId: string | null
): Promise<Leaderboard> {
  const weekStart = startOfUtcWeek();

  const grouped = await prisma.userProgress.groupBy({
    by: ["userId"],
    where: { completed: true, completedAt: { gte: weekStart } },
    _sum: { xpEarned: true },
    orderBy: { _sum: { xpEarned: "desc" } },
    take: 50,
  });

  const userIds = grouped.map((row) => row.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, avatarUrl: true, streak: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const rows: LeaderboardRow[] = grouped.map((row, index) => {
    const user = userMap.get(row.userId);
    return {
      rank: index + 1,
      userId: row.userId,
      username: user?.username ?? "unknown",
      avatarUrl: user?.avatarUrl ?? null,
      weeklyXp: row._sum.xpEarned ?? 0,
      streak: user?.streak ?? 0,
      isCurrentUser: row.userId === currentUserId,
    };
  });

  const currentRow = rows.find((r) => r.isCurrentUser);

  return {
    rows,
    weekStart: weekStart.toISOString(),
    currentUserRank: currentRow?.rank ?? null,
  };
}