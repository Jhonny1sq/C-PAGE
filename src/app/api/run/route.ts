import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { runCodeSchema, parseTestCases } from "@/lib/validation";
import {
  Judge0UnavailableError,
  runTestCases,
} from "@/lib/judge0";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Per-user execution rate limit: 20 runs per 60 seconds.
  const limit = rateLimit(`run:${userId}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Slow down a little — too many runs in a row.",
        retryAt: limit.resetAt,
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = runCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { lessonId, code, stdin, mode } = parsed.data;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, testCases: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const testCases = parseTestCases(lesson.testCases);

  try {
    // "run" mode runs the code with custom stdin without grading it.
    if (mode === "run") {
      const { submitToJudge0, explainCompileError, JUDGE0_STATUS } = await import(
        "@/lib/judge0"
      );
      const effectiveStdin =
        stdin && stdin.length > 0 ? stdin : testCases[0]?.stdin ?? "";
      const result = await submitToJudge0({ code, stdin: effectiveStdin });
      return NextResponse.json({
        mode: "custom",
        passed: false,
        passedCount: 0,
        total: 0,
        results: [],
        raw: {
          stdout: result.stdout,
          stderr: result.stderr,
          compileOutput: result.compileOutput,
          statusDescription: result.statusDescription,
          time: result.time,
          memory: result.memory,
        },
        compileHint:
          result.statusId === JUDGE0_STATUS.COMPILATION_ERROR
            ? explainCompileError(result.compileOutput)
            : null,
      });
    }

    const { results, passed, total } = await runTestCases(code, testCases);

    const compileOutput = results.find((r) => r.compileOutput)?.compileOutput ?? "";
    const { explainCompileError } = await import("@/lib/judge0");

    await prisma.submission.create({
      data: {
        userId,
        lessonId,
        code,
        passed: passed === total && total > 0,
        passedCount: passed,
        totalCount: total,
      },
    });

    return NextResponse.json({
      mode: "test",
      passed: passed === total && total > 0,
      passedCount: passed,
      total,
      results: results.map((r) => ({
        name: r.name,
        hidden: r.hidden,
        passed: r.passed,
        statusDescription: r.statusDescription,
        expected: r.hidden ? undefined : r.expected,
        actual: r.hidden ? undefined : r.actual,
        stderr: r.stderr,
        compileOutput: r.compileOutput,
      })),
      compileHint: explainCompileError(compileOutput),
    });
  } catch (error) {
    if (error instanceof Judge0UnavailableError) {
      return NextResponse.json(
        {
          error: "The compiler is napping right now. Try again in a moment.",
          code: "JUDGE0_DOWN",
        },
        { status: 503 }
      );
    }
    console.error("run route error", error);
    return NextResponse.json(
      { error: "Something went wrong running your code." },
      { status: 500 }
    );
  }
}