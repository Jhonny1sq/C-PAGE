import { z } from "zod";

export const signupSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(24, "Username must be at most 24 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const runCodeSchema = z.object({
  lessonId: z.string().min(1),
  code: z.string().min(1, "Write some code first.").max(20000),
  stdin: z.string().max(10000).optional().default(""),
  mode: z.enum(["grade", "run"]).default("grade"),
});

export const progressSchema = z.object({
  lessonId: z.string().min(1),
  code: z.string().max(20000).optional(),
  hintsUsed: z.number().int().min(0).max(10).optional(),
  attempts: z.number().int().min(0).max(1000).optional(),
  failed: z.boolean().optional(),
});

export const completeSchema = z.object({
  lessonId: z.string().min(1),
  code: z.string().max(20000).optional(),
  hintsUsed: z.number().int().min(0).max(10).default(0),
  attempts: z.number().int().min(1).max(1000).default(1),
});

export const testCaseSchema = z.object({
  name: z.string(),
  stdin: z.string().default(""),
  expectedOutput: z.string(),
  hidden: z.boolean().default(false),
});

export type TestCase = z.infer<typeof testCaseSchema>;

export function parseTestCases(raw: unknown): TestCase[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => testCaseSchema.safeParse(item))
    .filter((r) => r.success)
    .map((r) => r.data);
}