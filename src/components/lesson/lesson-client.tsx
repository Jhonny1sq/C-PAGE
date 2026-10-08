"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Send,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { CodeEditor } from "@/components/lesson/code-editor";
import { OutputPanel } from "@/components/lesson/output-panel";
import { HintsPanel } from "@/components/lesson/hints-panel";
import { Hearts } from "@/components/lesson/hearts";
import {
  CompletionModal,
  type CompletionData,
} from "@/components/lesson/completion-modal";
import { fireConfetti } from "@/lib/confetti";
import { HEARTS_PER_LESSON } from "@/lib/gamification";
import type {
  LessonView,
  PublicTestCase,
  RunResponse,
} from "@/lib/lesson-types";

export function LessonClient({
  lesson,
  publicTests,
  initialCode,
  initialHints,
  completed,
  nextSlug,
  basePath = "/learn",
}: {
  lesson: LessonView;
  publicTests: PublicTestCase[];
  initialCode: string;
  initialHints: number;
  completed: boolean;
  nextSlug: string | null;
  basePath?: string;
}) {
  const router = useRouter();

  const [code, setCode] = React.useState(initialCode);
  const [revealed, setRevealed] = React.useState(initialHints);
  const [attempts, setAttempts] = React.useState(0);
  const [hearts, setHearts] = React.useState(HEARTS_PER_LESSON);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<RunResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [judge0Down, setJudge0Down] = React.useState(false);
  const [completion, setCompletion] = React.useState<CompletionData | null>(null);
  const [showStdin, setShowStdin] = React.useState(false);
  const [stdin, setStdin] = React.useState("");
  const [justCompleted, setJustCompleted] = React.useState(completed);

  // Debounced autosave of code + hint usage.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, code, hintsUsed: revealed }),
      }).catch(() => {});
    }, 1200);
    return () => clearTimeout(timer);
  }, [code, revealed, lesson.id]);

  async function saveProgress(extra: Record<string, unknown>) {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, ...extra }),
    }).catch(() => {});
  }

  async function runMode(mode: "grade" | "run") {
    setLoading(true);
    setError(null);
    setJudge0Down(false);
    setResult(null);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, code, stdin, mode }),
      });

      if (response.status === 503) {
        setJudge0Down(true);
        return;
      }
      if (response.status === 429) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? "Too many runs. Wait a moment.");
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? "Something went wrong running your code.");
        return;
      }

      const data = (await response.json()) as RunResponse;
      setResult(data);

      if (mode === "grade") {
        const attemptNumber = attempts + 1;
        setAttempts(attemptNumber);

        if (data.passed) {
          await handlePass(attemptNumber);
        } else {
          setHearts((h) => Math.max(0, h - 1));
          setJustCompleted(false);
          await saveProgress({
            attempts: attemptNumber,
            failed: true,
            hintsUsed: revealed,
          });
        }
      }
    } catch {
      setJudge0Down(true);
    } finally {
      setLoading(false);
    }
  }

  async function handlePass(attemptNumber: number) {
    fireConfetti();
    setJustCompleted(true);

    const response = await fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: lesson.id,
        code,
        hintsUsed: revealed,
        attempts: attemptNumber,
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as {
      xp: number;
      totalXp: number;
      streak: number;
      alreadyCompleted: boolean;
      achievements: CompletionData["achievements"];
      nextReviewAt: string;
    };

    setCompletion({
      xp: data.xp,
      totalXp: data.totalXp,
      streak: data.streak,
      alreadyCompleted: data.alreadyCompleted,
      achievements: data.achievements,
      nextReviewAt: data.nextReviewAt,
    });
    router.refresh();
  }

  function onRevealHint() {
    setRevealed((r) => Math.min(r + 1, lesson.hints.length));
  }

  function onShowSolution() {
    setCode(lesson.solutionCode);
    setRevealed(lesson.hints.length);
    saveProgress({ hintsUsed: lesson.hints.length });
  }

  function retryLesson() {
    setHearts(HEARTS_PER_LESSON);
    setResult(null);
    setError(null);
    setAttempts(0);
  }

  const outOfHearts = hearts === 0 && !justCompleted;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to path
        </Link>
        <div className="flex items-center gap-3">
          <Hearts value={hearts} />
          <Badge variant="gold">
            <Zap className="h-3 w-3" /> {lesson.xpReward} XP
          </Badge>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{lesson.chapterIcon ?? "📘"}</span>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {lesson.chapterTitle}
        </span>
      </div>
      <h1 className="text-2xl font-black text-slate-50 sm:text-3xl">
        {lesson.title}
      </h1>

      {/* Guide */}
      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <Markdown content={lesson.guideContent} />
      </section>

      {/* Guided example */}
      <section className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Guided example
          </h2>
        </div>
        <CodeEditor value={lesson.exampleCode} readOnly height="240px" />
        {lesson.exampleOutput ? (
          <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300">
            {lesson.exampleOutput}
          </pre>
        ) : null}
      </section>

      {/* Challenge */}
      <section className="mt-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Your code
          </span>
          {publicTests.length > 0 ? (
            <span className="text-xs text-slate-500">
              {publicTests.filter((t) => !t.hidden).length}+ test case
              {publicTests.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        <CodeEditor value={code} onChange={setCode} height="360px" />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            onClick={() => runMode("grade")}
            disabled={loading || outOfHearts}
          >
            <Play className="h-4 w-4" /> Run &amp; check
          </Button>
          <Button
            variant="secondary"
            onClick={() => runMode("run")}
            disabled={loading}
          >
            <TerminalSquare className="h-4 w-4" /> Quick run
          </Button>
          {!justCompleted ? (
            <Button
              variant="outline"
              onClick={() => runMode("grade")}
              disabled={loading || outOfHearts}
            >
              <Send className="h-4 w-4" /> Submit
            </Button>
          ) : (
            <Badge variant="default">Completed</Badge>
          )}
          <button
            type="button"
            onClick={() => setShowStdin((s) => !s)}
            className="ml-auto text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            {showStdin ? "Hide" : "Custom"} input
          </button>
        </div>

        {showStdin ? (
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Optional stdin for Quick run (each test uses its own input for grading)"
            className="mt-3 h-20 w-full rounded-xl border border-slate-700 bg-slate-950/60 p-3 font-mono text-xs text-slate-200 focus-visible:border-emerald-400 focus-visible:outline-none"
          />
        ) : null}

        {outOfHearts ? (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
            <p className="text-sm text-rose-200">
              You are out of hearts for this lesson.
            </p>
            <Button size="sm" variant="danger" className="ml-auto" onClick={retryLesson}>
              <RotateCcw className="h-3.5 w-3.5" /> Retry lesson
            </Button>
          </div>
        ) : null}

        <div className="mt-4">
          <OutputPanel
            loading={loading}
            result={result}
            error={error}
            judge0Down={judge0Down}
            onRetry={() => runMode("grade")}
          />
        </div>
      </section>

      {/* Hints */}
      <section className="mt-6">
        <HintsPanel
          hints={lesson.hints}
          revealed={revealed}
          onReveal={onRevealHint}
          onShowSolution={onShowSolution}
        />
      </section>

      <CompletionModal
        data={completion}
        nextSlug={nextSlug}
        basePath={basePath}
        onClose={() => setCompletion(null)}
      />
    </div>
  );
}