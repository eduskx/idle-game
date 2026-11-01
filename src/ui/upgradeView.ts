import { milestoneMult } from '../engine/formulas';
import type { UpgradeId } from '../engine/types';

/** Levels between two ×2 milestones of the multiplier upgrades. */
export const MILESTONE_EVERY = 25;

export type EffectKind = 'atk' | 'hp' | 'gold' | 'xp' | 'crit' | 'speed' | 'slots';

export interface UpgradeView {
  effect: EffectKind;
  /** 'mult' values are multipliers (×), 'add' values are flat bonuses (+, in % or slots). */
  format: 'mult' | 'pct' | 'count';
  now: number;
  next: number;
  /** Progress towards the next ×2 milestone, only for the multiplier upgrades. */
  milestone?: { at: number; into: number; left: number };
}

const MULT: Partial<Record<UpgradeId, { effect: EffectKind; perLevel: number }>> = {
  sharpen: { effect: 'atk', perLevel: 0.2 },
  vitality: { effect: 'hp', perLevel: 0.2 },
  greed: { effect: 'gold', perLevel: 0.15 },
  wisdom: { effect: 'xp', perLevel: 0.15 },
};

/** What a gold upgrade gives now and after one more level (mirrors engine/stats.ts). */
export function upgradeView(id: UpgradeId, level: number): UpgradeView {
  const m = MULT[id];
  if (m) {
    const at = (Math.floor(level / MILESTONE_EVERY) + 1) * MILESTONE_EVERY;
    return {
      effect: m.effect,
      format: 'mult',
      now: milestoneMult(level, m.perLevel),
      next: milestoneMult(level + 1, m.perLevel),
      milestone: { at, into: level % MILESTONE_EVERY, left: at - level },
    };
  }
  if (id === 'focus') return { effect: 'crit', format: 'pct', now: level, next: level + 1 };
  if (id === 'swiftness') return { effect: 'speed', format: 'pct', now: 2 * level, next: 2 * (level + 1) };
  return { effect: 'slots', format: 'count', now: level, next: level + 1 };
}
