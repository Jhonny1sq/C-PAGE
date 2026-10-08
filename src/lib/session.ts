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
  return prisma.user.findUnique({ where: { id: userId } });
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}