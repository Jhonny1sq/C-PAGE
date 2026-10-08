"use client";

import { Lightbulb, Lock, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";

export function HintsPanel({
  hints,
  revealed,
  onReveal,
  onShowSolution,
}: {
  hints: string[];
  revealed: number;
  onReveal: () => void;
  onShowSolution: () => void;
}) {
  const hasMore = revealed < hints.length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-bold text-slate-200">Hints</span>
        <span className="ml-auto text-xs text-slate-500">
          {hints.length - revealed} left
        </span>
      </div>

      {revealed === 0 ? (
        <p className="mt-2 text-xs text-slate-400">
          Stuck? Reveal a hint, but each one costs you XP.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
            >
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Hint {i + 1}
              </p>
              <Markdown content={hint} className="text-xs" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={hasMore ? "secondary" : "ghost"}
          disabled={!hasMore}
          onClick={onReveal}
        >
          {hasMore ? (
            <>
              <Lightbulb className="h-3.5 w-3.5" /> Reveal hint {revealed + 1}
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" /> All hints shown
            </>
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onShowSolution}
          className="text-slate-400"
        >
          <WandSparkles className="h-3.5 w-3.5" /> Show solution
        </Button>
      </div>
    </div>
  );
}