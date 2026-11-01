import { CHARMS, CHARM_BY_ID, type CharmId } from '../data/charms';
import { roll } from './rng';
import type { CreatureType, GameState } from './types';

export function charmLevel(s: GameState, id: CharmId): number {
  return s.charms[id] ?? 0;
}

/** Fractional bonus of a charm (e.g. 0.15 = +15%). */
export function charmBonus(s: GameState, id: CharmId): number {
  return charmLevel(s, id) * CHARM_BY_ID[id].perLevel;
}

/** Summed bonus of the type cores matching any of a creature's types. */
export function typeCharmBonus(s: GameState, types: readonly CreatureType[]): number {
  return CHARMS.filter((c) => c.type && types.includes(c.type)).reduce(
    (sum, c) => sum + charmBonus(s, c.id),
    0,
  );
}

export function totalCharmLevels(s: GameState): number {
  return Object.values(s.charms).reduce((sum, lvl) => sum + lvl, 0);
}

/**
 * Drop chance with diminishing returns: every charm level owned makes the next one
 * rarer, so charms stay a long-term chase instead of snowballing.
 */
export function charmDropChance(s: GameState, base: number): number {
  return base / (1 + totalCharmLevels(s) / 8);
}

/** Grants +1 level to a random non-maxed charm. Returns its id, or null if all are maxed. */
export function grantRandomCharm(s: GameState): CharmId | null {
  const open = CHARMS.filter((c) => charmLevel(s, c.id) < c.maxLevel);
  if (open.length === 0) return null;
  const def = open[Math.floor(roll(s) * open.length)] ?? open[0]!;
  s.charms[def.id] = charmLevel(s, def.id) + 1;
  return def.id;
}
