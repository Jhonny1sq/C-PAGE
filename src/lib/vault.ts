import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const VAULT_COOKIE = "cpage_vault";
const VAULT_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

function vaultSigningSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function sign(payload: string): string | null {
  const secret = vaultSigningSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** timing-safe comparison so wrong guesses don't leak prefix info */
export function keyMatches(provided: string): boolean {
  const expected = process.env.SECRET_KEY ?? "";
  if (!expected) return false;
  const a = Buffer.from(provided, "utf-8");
  const b = Buffer.from(expected, "utf-8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function vaultEnabled(): boolean {
  return Boolean(process.env.SECRET_KEY);
}

/** Signed cookie value binding the grant to one user id. */
export function buildVaultGrant(userId: string): string | null {
  const exp = Math.floor(Date.now() / 1000) + VAULT_TTL_SECONDS;
  const payload = `${userId}.${exp}`;
  const sig = sign(payload);
  if (!sig) return null;
  return `${payload}.${sig}`;
}

export async function hasVaultAccess(userId: string): Promise<boolean> {
  if (!vaultEnabled()) return false;
  const store = await cookies();
  const raw = store.get(VAULT_COOKIE)?.value;
  if (!raw) return false;

  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [grantedUserId, expRaw, sig] = parts;
  if (grantedUserId !== userId) return false;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expectedSig = sign(`${grantedUserId}.${expRaw}`);
  if (!expectedSig) return false;

  const a = Buffer.from(sig, "utf-8");
  const b = Buffer.from(expectedSig, "utf-8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
