"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MountainSnow,
  RefreshCw,
  Terminal,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RunResponse } from "@/lib/lesson-types";

export function OutputPanel({
  loading,
  result,
  error,
  judge0Down,
  onRetry,
}: {
  loading: boolean;
  result: RunResponse | null;
  error: string | null;
  judge0Down: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
        <Terminal className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Output
        </span>
        {result ? (
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 text-xs font-bold",
              result.passed
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-rose-500/15 text-rose-300"
            )}
          >
            {result.mode === "test"
              ? `${result.passedCount}/${result.total} passed`
              : result.raw?.statusDescription ?? "ran"}
          </span>
        ) : null}
      </div>

      <div className="max-h-[420px] overflow-auto p-4 font-mono text-xs leading-relaxed">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Compiling and running…
          </div>
        ) : judge0Down ? (
          <div className="flex flex-col items-start gap-3 py-2 font-sans">
            <div className="flex items-center gap-2 text-amber-300">
              <MountainSnow className="h-5 w-5" />
              <span className="font-bold">The compiler is napping.</span>
            </div>
            <p className="text-xs text-slate-400">
              Judge0 did not answer. This usually passes in a few seconds.
            </p>
            <Button size="sm" variant="secondary" onClick={onRetry}>
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 font-sans text-rose-300">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        ) : !result ? (
          <p className="font-sans text-slate-500">
            Hit <span className="font-bold text-slate-300">Run</span> to compile
            your code and check it against the tests.
          </p>
        ) : result.mode === "custom" && result.raw ? (
          <pre className="whitespace-pre-wrap text-slate-200">
            {result.raw.stdout || "<no stdout>"}
            {result.raw.stderr ? (
              <span className="text-rose-300">{"\n" + result.raw.stderr}</span>
            ) : null}
            {result.raw.compileOutput ? (
              <span className="text-amber-300">
                {"\n" + result.raw.compileOutput}
              </span>
            ) : null}
          </pre>
        ) : (
          <div className="space-y-2 font-sans">
            {result.compileHint ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                {result.compileHint}
              </p>
            ) : null}
            {result.results.map((test) => (
              <div
                key={test.name}
                className={cn(
                  "rounded-lg border px-3 py-2.5",
                  test.passed
                    ? "border-emerald-500/25 bg-emerald-500/5"
                    : "border-rose-500/25 bg-rose-500/5"
                )}
              >
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                  <span className="text-xs font-bold text-slate-200">
                    {test.hidden ? "Hidden test" : test.name}
                  </span>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-500">
                    {test.statusDescription}
                  </span>
                </div>
                {!test.passed ? (
                  <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                    {test.compileOutput ? (
                      <pre className="whitespace-pre-wrap text-amber-300">
                        {test.compileOutput}
                      </pre>
                    ) : (
                      <>
                        <p className="text-slate-400">
                          Expected:{" "}
                          <span className="text-emerald-300">
                            {JSON.stringify(test.expected)}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Got:{" "}
                          <span className="text-rose-300">
                            {JSON.stringify(test.actual ?? "")}
                          </span>
                        </p>
                        {test.stderr ? (
                          <pre className="whitespace-pre-wrap text-rose-300">
                            {test.stderr}
                          </pre>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}