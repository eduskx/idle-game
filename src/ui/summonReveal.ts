import { RARITY_ORDER } from '../data/creatures';
import type { Rarity } from '../engine/types';

/** Flash length after the circle has charged (ms). */
export const FLASH_MS = 320;

/**
 * How long the summoning circle charges before a creature appears (ms).
 * Rarer creatures take longer (more anticipation); in a ×10 batch every step is shorter
 * so the whole sequence stays watchable.
 */
export function chargeMs(rarity: Rarity, multi: boolean): number {
  const tier = RARITY_ORDER.indexOf(rarity);
  const base = multi ? 420 : 780;
  return base + Math.max(0, tier) * (multi ? 120 : 220);
}
