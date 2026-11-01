export interface ExpeditionDuration {
  id: 'short' | 'medium' | 'long' | 'epic';
  seconds: number;
  /** Chance to bring back a charm. */
  charmChance: number;
}

export const EXPEDITION_DURATIONS: ExpeditionDuration[] = [
  { id: 'short', seconds: 15 * 60, charmChance: 0.03 },
  { id: 'medium', seconds: 60 * 60, charmChance: 0.12 },
  { id: 'long', seconds: 4 * 3600, charmChance: 0.4 },
  { id: 'epic', seconds: 8 * 3600, charmChance: 0.8 },
];

/** Highest lifetime stage needed before expeditions unlock. */
export const EXPEDITION_UNLOCK_STAGE = 25;
export const EXPEDITION_SLOTS = 3;
