import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getUserId();
  if (!userId) return null;
  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    // Never swallow Next.js control-flow signals (dynamic usage, redirects).
    if (isNextControlFlowError(error)) throw error;
    // A missing database or a transient outage should degrade to "logged out"
    // for rendering purposes rather than crashing the whole route.
    console.error("getCurrentUser failed", error);
    return null;
  }
}

function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }
  const digest = (error as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest === "DYNAMIC_SERVER_USAGE" ||
      digest.startsWith("NEXT_") ||
      digest.startsWith("NEXT_REDIRECT") ||
      digest.startsWith("NEXT_NOT_FOUND"))
  );
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}