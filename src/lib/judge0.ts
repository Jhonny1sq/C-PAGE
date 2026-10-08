import "server-only";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL ?? "https://ce.judge0.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST;
const CPP_LANGUAGE_ID = Number(process.env.JUDGE0_CPP_LANGUAGE_ID ?? "54");
const REQUEST_TIMEOUT_MS = Number(process.env.JUDGE0_TIMEOUT_MS ?? "20000");

export class Judge0UnavailableError extends Error {
  constructor(message = "The compiler is napping right now.") {
    super(message);
    this.name = "Judge0UnavailableError";
  }
}

export interface Judge0Result {
  stdout: string;
  stderr: string;
  compileOutput: string;
  message: string;
  statusId: number;
  statusDescription: string;
  time: string | null;
  memory: number | null;
}

export interface Judge0Status {
  id: number;
  description: string;
}

export const JUDGE0_STATUS = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR_SIGSEGV: 11,
  INTERNAL_ERROR: 13,
} as const;

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (JUDGE0_API_KEY && JUDGE0_API_HOST) {
    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;
  }
  return headers;
}

function encodeBase64(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64");
}

function decodeBase64(value: string | null): string {
  if (!value) return "";
  try {
    return Buffer.from(value, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

interface RawSubmission {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: Judge0Status | null;
  time: string | null;
  memory: number | null;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export interface SubmitOptions {
  code: string;
  stdin?: string;
  expectedOutput?: string;
}

export async function submitToJudge0({
  code,
  stdin = "",
  expectedOutput,
}: SubmitOptions): Promise<Judge0Result> {
  const body: Record<string, unknown> = {
    source_code: encodeBase64(code),
    language_id: CPP_LANGUAGE_ID,
    stdin: encodeBase64(stdin),
  };
  if (typeof expectedOutput === "string") {
    body.expected_output = encodeBase64(expectedOutput);
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`,
      { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }
    );
  } catch {
    throw new Judge0UnavailableError();
  }

  if (!response.ok) {
    throw new Judge0UnavailableError(
      `Compiler responded with ${response.status}.`
    );
  }

  let raw: RawSubmission;
  try {
    raw = (await response.json()) as RawSubmission;
  } catch {
    throw new Judge0UnavailableError();
  }

  return {
    stdout: decodeBase64(raw.stdout),
    stderr: decodeBase64(raw.stderr),
    compileOutput: decodeBase64(raw.compile_output),
    message: decodeBase64(raw.message),
    statusId: raw.status?.id ?? 0,
    statusDescription: raw.status?.description ?? "Unknown",
    time: raw.time,
    memory: raw.memory,
  };
}

export interface TestCaseInput {
  name: string;
  stdin: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface TestCaseResult {
  name: string;
  hidden: boolean;
  passed: boolean;
  statusDescription: string;
  expected: string;
  actual: string;
  stderr: string;
  compileOutput: string;
  time: string | null;
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\s+$/g, "").trimEnd();
}

export async function runTestCases(
  code: string,
  testCases: TestCaseInput[]
): Promise<{ results: TestCaseResult[]; passed: number; total: number }> {
  const results: TestCaseResult[] = [];

  for (const testCase of testCases) {
    const submission = await submitToJudge0({
      code,
      stdin: testCase.stdin,
      expectedOutput: testCase.expectedOutput,
    });

    const passed =
      submission.statusId === JUDGE0_STATUS.ACCEPTED &&
      normalize(submission.stdout) === normalize(testCase.expectedOutput);

    results.push({
      name: testCase.name,
      hidden: testCase.hidden,
      passed,
      statusDescription: submission.statusDescription,
      expected: testCase.expectedOutput,
      actual: submission.stdout,
      stderr: submission.stderr,
      compileOutput: submission.compileOutput,
      time: submission.time,
    });

    if (
      submission.statusId === JUDGE0_STATUS.COMPILATION_ERROR ||
      submission.statusId === JUDGE0_STATUS.INTERNAL_ERROR
    ) {
      break;
    }
  }

  const passed = results.filter((r) => r.passed).length;
  return { results, passed, total: testCases.length };
}

const FRIENDLY_COMPILE_HINTS: Array<{ pattern: RegExp; hint: string }> = [
  {
    pattern: /was not declared in this scope/i,
    hint: "One of your variables is used before it exists, or the name is misspelled. Check the spelling and make sure you declared it first.",
  },
  {
    pattern: /expected ';'/i,
    hint: "You are missing a semicolon. Every statement in C++ ends with `;`.",
  },
  {
    pattern: /'(\w+)' was not declared/i,
    hint: "C++ could not find that name. Did you forget `#include <iostream>` or a `std::` prefix?",
  },
  {
    pattern: /no member named/i,
    hint: "You are calling a member that does not exist on that type. Double-check the method or field name.",
  },
  {
    pattern: /conversion from .* to .*/i,
    hint: "You are mixing incompatible types. Match your types, or add an explicit cast.",
  },
  {
    pattern: /redefinition of/i,
    hint: "Something is defined twice. Rename one of the variables or functions.",
  },
  {
    pattern: /no matching function for call/i,
    hint: "The function exists but not with those argument types. Check the order, count, and types of the arguments.",
  },
];

export function explainCompileError(compileOutput: string): string | null {
  for (const { pattern, hint } of FRIENDLY_COMPILE_HINTS) {
    if (pattern.test(compileOutput)) return hint;
  }
  return null;
}