export const PERFECT_BONUS = 10;
export const HINT_PENALTY_FRACTION = 0.2;
export const MIN_XP_FRACTION = 0.2;

export interface XpBreakdown {
  base: number;
  hintPenalty: number;
  attemptPenalty: number;
  perfectBonus: number;
  total: number;
}

/**
 * More hints and more attempts mean less XP. A clean first try earns a bonus.
 */
export function calculateXp(
  base: number,
  hintsUsed: number,
  attempts: number
): XpBreakdown {
  const hintPenalty = Math.round(
    base * HINT_PENALTY_FRACTION * Math.min(hintsUsed, 4)
  );
  const attemptPenalty = Math.round(
    base * HINT_PENALTY_FRACTION * Math.max(0, Math.min(attempts - 1, 4))
  );
  const floor = Math.round(base * MIN_XP_FRACTION);
  const earnedAfterPenalties = Math.max(floor, base - hintPenalty - attemptPenalty);
  const perfectBonus =
    hintsUsed === 0 && attempts <= 1 ? PERFECT_BONUS : 0;

  return {
    base,
    hintPenalty,
    attemptPenalty,
    perfectBonus,
    total: earnedAfterPenalties + perfectBonus,
  };
}

export const HEARTS_PER_LESSON = 3;
export const GEM_COST_REFILL = 50;

export function utcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86_400_000
  );
}

export function utcDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export interface StreakInput {
  currentStreak: number;
  lastActiveAt: Date | null;
  now: Date;
}

export interface StreakOutput {
  streak: number;
  changed: boolean;
}

/**
 * Rules:
 *  - same UTC day  -> unchanged
 *  - yesterday     -> +1
 *  - older / none  -> reset to 1
 * A single missed day breaks the chain (no freeze by default).
 */
export function advanceStreak({
  currentStreak,
  lastActiveAt,
  now,
}: StreakInput): StreakOutput {
  if (!lastActiveAt) return { streak: 1, changed: true };

  const today = utcDayNumber(now);
  const last = utcDayNumber(lastActiveAt);
  const delta = today - last;

  if (delta === 0) return { streak: currentStreak, changed: false };
  if (delta === 1) return { streak: currentStreak + 1, changed: true };
  if (delta > 1) return { streak: 1, changed: currentStreak !== 1 };

  // Clock skew / future date — keep as-is.
  return { streak: currentStreak, changed: false };
}