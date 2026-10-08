import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import {
  VAULT_COOKIE,
  buildVaultGrant,
  keyMatches,
  vaultEnabled,
} from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unlockSchema = z.object({
  key: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!vaultEnabled()) {
    return NextResponse.json(
      { error: "The vault is disabled on this server." },
      { status: 503 }
    );
  }

  const limit = rateLimit(`vault:${userId}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Wait a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = unlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the passphrase." }, { status: 400 });
  }

  if (!keyMatches(parsed.data.key)) {
    return NextResponse.json({ error: "Wrong passphrase." }, { status: 403 });
  }

  const grant = buildVaultGrant(userId);
  if (!grant) {
    return NextResponse.json(
      { error: "Server is missing AUTH_SECRET." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(VAULT_COOKIE, grant, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
