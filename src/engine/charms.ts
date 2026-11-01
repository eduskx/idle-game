import { CHARMS, CHARM_BY_ID, type CharmId } from '../data/charms';
import { roll } from './rng';
import type { Element, GameState } from './types';

export function charmLevel(s: GameState, id: CharmId): number {
  return s.charms[id] ?? 0;
}

/** Fractional bonus of a charm (e.g. 0.15 = +15%). */
export function charmBonus(s: GameState, id: CharmId): number {
  return charmLevel(s, id) * CHARM_BY_ID[id].perLevel;
}

export function elementCharmBonus(s: GameState, element: Element): number {
  const def = CHARMS.find((c) => c.element === element);
  return def ? charmBonus(s, def.id) : 0;
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
