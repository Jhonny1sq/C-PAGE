"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AchievementView } from "@/lib/lesson-types";

export interface CompletionData {
  xp: number;
  totalXp: number;
  streak: number;
  alreadyCompleted: boolean;
  achievements: AchievementView[];
  nextReviewAt: string;
}

export function CompletionModal({
  data,
  nextSlug,
  onClose,
  basePath = "/learn",
}: {
  data: CompletionData | null;
  nextSlug: string | null;
  onClose: () => void;
  basePath?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);

  if (!data || !open) return null;

  function goNext() {
    setOpen(false);
    onClose();
    router.push(nextSlug ? `${basePath}/${nextSlug}` : basePath);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md animate-[float-up_0.3s_ease-out] rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={() => {
            setOpen(false);
            onClose();
          }}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-3xl">
            <PartyPopper className="h-8 w-8 text-emerald-400" />
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-50">
            {data.alreadyCompleted ? "Nice, run it back" : "Lesson complete!"}
          </h2>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="text-xl font-black text-yellow-300">
              +{data.xp} XP
            </span>
          </div>

          <div className="mt-4 grid w-full grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-500">Streak</p>
              <p className="font-bold text-orange-400">{data.streak} days</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-500">Total XP</p>
              <p className="font-bold text-slate-100">{data.totalXp}</p>
            </div>
          </div>

          {data.achievements.length > 0 ? (
            <div className="mt-4 w-full space-y-2">
              <p className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Unlocked
              </p>
              {data.achievements.map((a) => (
                <div
                  key={a.type}
                  className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-left"
                >
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-100">{a.label}</p>
                    <p className="text-xs text-slate-400">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <p className="mt-4 text-xs text-slate-500">
            Review scheduled for{" "}
            {new Date(data.nextReviewAt).toLocaleDateString()}.
          </p>

          <div className="mt-5 flex w-full flex-col gap-2 sm:flex-row">
            <Button variant="secondary" className="flex-1" onClick={() => {
              setOpen(false);
              onClose();
            }}>
              Stay here
            </Button>
            <Button className="flex-1" onClick={goNext}>
              {nextSlug ? "Next lesson" : "Back to path"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}