import { isBossStage, type CombatEvent } from '../engine';

/** One-shot reactions of the tamer on the battle stage. */
export type TamerReaction = 'cheer' | 'triumph' | 'flinch';

/** How long each reaction plays (ms); matches the CSS animations. */
export const TAMER_REACTION_MS: Record<TamerReaction, number> = {
  cheer: 1100,
  triumph: 1600,
  flinch: 900,
};

/**
 * Picks the tamer's reaction to a batch of fresh combat events, or null.
 * A loss outranks a win (a defeat in the same tick is what the player needs to notice),
 * a cleared boss stage outranks a normal one. Kills and hits get no reaction: they come every
 * second and would turn the tamer into noise.
 */
export function tamerReaction(events: readonly CombatEvent[]): TamerReaction | null {
  if (events.some((e) => e.t === 'defeat' || e.t === 'bossFail')) return 'flinch';
  const clears = events.filter((e): e is Extract<CombatEvent, { t: 'stageClear' }> => e.t === 'stageClear');
  if (clears.some((e) => isBossStage(e.stage))) return 'triumph';
  return clears.length > 0 ? 'cheer' : null;
}
