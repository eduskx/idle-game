import { getEnemy, getZone } from '../data/world';
import { typeMultiplier } from './formulas';
import type { CreatureType } from './types';

export type Matchup = 'strong' | 'weak' | 'neutral';

/** Distinct enemy types of a zone (regular enemies and the boss), in first-seen order. */
export function zoneEnemyTypes(zoneIndex: number): CreatureType[] {
  const zone = getZone(zoneIndex);
  const seen = new Set<CreatureType>();
  for (const id of [...zone.enemies, zone.boss]) for (const ty of getEnemy(id).types) seen.add(ty);
  return [...seen];
}

/**
 * How well a creature fares in a zone: its average damage multiplier against the zone's
 * species divided by the average multiplier they deal back. ≥ 1.15 is "strong", ≤ 0.87 "weak".
 */
export function matchupScore(types: readonly CreatureType[], zoneIndex: number): number {
  const zone = getZone(zoneIndex);
  const foes = [...zone.enemies, zone.boss].map((id) => getEnemy(id).types);
  const dealt = foes.reduce((sum, f) => sum + typeMultiplier(types, f), 0) / foes.length;
  const taken = foes.reduce((sum, f) => sum + typeMultiplier(f, types), 0) / foes.length;
  return dealt / taken;
}

export function zoneMatchup(types: readonly CreatureType[], zoneIndex: number): Matchup {
  const score = matchupScore(types, zoneIndex);
  if (score >= 1.15) return 'strong';
  if (score <= 0.87) return 'weak';
  return 'neutral';
}
