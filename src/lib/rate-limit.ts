import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

const globalForLimit = globalThis as unknown as {
  __cpageRateLimit?: Map<string, Bucket>;
};

const buckets: Map<string, Bucket> =
  globalForLimit.__cpageRateLimit ??
  (globalForLimit.__cpageRateLimit = new Map());

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Fixed-window in-memory limiter. Good enough for a single Node process.
 * On multi-instance deployments (e.g. Vercel), swap the store for Upstash Redis.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Cleans stale buckets so the map does not grow without bound. */
export function sweepRateLimit() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}