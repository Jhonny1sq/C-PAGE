import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Flame, Gem, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getOverview } from "@/lib/dashboard";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Profile — C-PAGE" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  const overview = await getOverview(user.id);
  const unlockedCount = overview.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:text-left">
          <Avatar
            src={user.avatarUrl}
            alt={user.username}
            fallback={user.username}
            className="h-20 w-20 text-2xl"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-50">
              {user.username}
            </h1>
            <p className="text-sm text-slate-400">{user.email}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500 sm:justify-start">
              <CalendarDays className="h-3.5 w-3.5" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ProfileStat
          icon={<Zap className="h-5 w-5" />}
          value={user.xp}
          label="Total XP"
          color="text-yellow-400"
        />
        <ProfileStat
          icon={<Flame className="h-5 w-5" />}
          value={user.streak}
          label="Day streak"
          color="text-orange-400"
        />
        <ProfileStat
          icon={<Gem className="h-5 w-5" />}
          value={user.gems}
          label="Gems"
          color="text-sky-400"
        />
        <ProfileStat
          icon={<span className="text-lg">📘</span>}
          value={`${overview.completedLessons}/${overview.totalLessons}`}
          label="Lessons"
          color="text-emerald-400"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Achievements</span>
            <Badge variant="gold">
              {unlockedCount}/{overview.achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {overview.achievements.map((achievement) => (
            <div
              key={achievement.type}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3",
                achievement.unlocked
                  ? "border-yellow-500/30 bg-yellow-500/5"
                  : "border-slate-800 bg-slate-950/40"
              )}
            >
              <span
                className={cn(
                  "text-2xl",
                  achievement.unlocked ? "" : "grayscale opacity-40"
                )}
              >
                {achievement.icon}
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-bold",
                    achievement.unlocked ? "text-slate-100" : "text-slate-500"
                  )}
                >
                  {achievement.label}
                </p>
                <p className="text-xs text-slate-500">
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt ? (
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-yellow-500/80">
                    Unlocked{" "}
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileStat({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
      <span className={cn("inline-flex", color)}>{icon}</span>
      <p className="mt-1 text-xl font-black text-slate-50">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}