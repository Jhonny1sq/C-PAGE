import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deletes all progress, achievements, and streak history for the signed-in
 * user. The account and its XP totals are reset too. Requires ?confirm=reset.
 */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("confirm") !== "reset") {
    return NextResponse.json(
      { error: "Add ?confirm=reset to confirm this action." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.userProgress.deleteMany({ where: { userId } }),
    prisma.achievement.deleteMany({ where: { userId } }),
    prisma.streak.deleteMany({ where: { userId } }),
    prisma.submission.deleteMany({ where: { userId } }),
    prisma.user.update({
      where: { id: userId },
      data: { xp: 0, streak: 0, gems: 0, lastActiveAt: null },
    }),
  ]);

  return NextResponse.json({ ok: true });
}