import type { EnemyDef, Realm, ZoneDef } from '../engine/types';
import { CREATURES } from './creatures';

/**
 * Enemies are wild members of the same 10 species the player can collect (like in
 * classic monster tamers). Bosses are "alpha" specimens: bigger, crowned, much tougher.
 */
const WILD_STATS: Record<string, { hp: number; atk: number }> = {
  guardian: { hp: 1.4, atk: 0.8 },
  bruiser: { hp: 1.15, atk: 1 },
  striker: { hp: 0.85, atk: 1.25 },
  support: { hp: 1, atk: 0.9 },
  swift: { hp: 0.8, atk: 1.15 },
};

export const ENEMIES: EnemyDef[] = CREATURES.flatMap((c) => {
  const w = WILD_STATS[c.archetype]!;
  const base = { species: c.id, realm: c.realm, types: c.types, hpMult: w.hp, atkMult: w.atk };
  return [
    { ...base, id: `wild_${c.id}`, alpha: false },
    { ...base, id: `alpha_${c.id}`, alpha: true },
  ];
});

export const ENEMY_BY_ID: Record<string, EnemyDef> = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

export function getEnemy(id: string): EnemyDef {
  const def = ENEMY_BY_ID[id];
  if (!def) throw new Error(`Unknown enemy: ${id}`);
  return def;
}

function zone(id: string, realm: Realm, species: string[], boss: string, palette: [string, string]): ZoneDef {
  return { id, realm, enemies: species.map((s) => `wild_${s}`), boss: `alpha_${boss}`, palette };
}

/**
 * Zones alternate between the cozy Hearth and the dark Umbra so both moods appear
 * early. After the last defined zone the list repeats with ever-growing numbers
 * ("Endless" cycles), so there is no hard progression ceiling.
 */
export const ZONES: ZoneDef[] = [
  zone('meadow', 'hearth', ['mossling', 'emberpup', 'puddlefin'], 'mossling', ['#b8e0a8', '#f7e7b4']),
  zone('hollow', 'umbra', ['gloomwisp', 'bonecrow', 'hexcat'], 'bonecrow', ['#2b2140', '#4b2f5a']),
  zone('pond', 'hearth', ['puddlefin', 'teacup', 'mossling'], 'puddlefin', ['#a6d8e8', '#e0f2e9']),
  zone('crypt', 'umbra', ['bonecrow', 'drownedknight', 'gloomwisp'], 'hexcat', ['#1d1d2b', '#3a3550']),
  zone('hearthtown', 'hearth', ['emberpup', 'teacup', 'honeybear'], 'teacup', ['#f3c99b', '#fbe8d0']),
  zone('ashfields', 'umbra', ['hexcat', 'gloomwisp', 'eclipsewyrm'], 'gloomwisp', ['#3a1a1a', '#6b2d22']),
  zone('orchard', 'hearth', ['honeybear', 'mossling', 'emberpup'], 'honeybear', ['#d7e8a2', '#f4d7c4']),
  zone('drownedcity', 'umbra', ['drownedknight', 'eclipsewyrm', 'bonecrow'], 'drownedknight', [
    '#10283a',
    '#1f3f55',
  ]),
  zone('snowpeak', 'hearth', ['teacup', 'puddlefin', 'honeybear'], 'emberpup', ['#dfeaf5', '#ffffff']),
  zone('abyss', 'umbra', ['eclipsewyrm', 'hexcat', 'drownedknight'], 'eclipsewyrm', ['#0b0b18', '#24163a']),
  zone('starglade', 'hearth', ['emberpup', 'puddlefin', 'teacup'], 'honeybear', ['#2a3a6b', '#8a7bc8']),
  zone('eclipse', 'umbra', ['eclipsewyrm', 'drownedknight', 'hexcat'], 'eclipsewyrm', ['#1a0f1f', '#4a1030']),
];

export function getZone(zoneIndex: number): ZoneDef {
  const z = ZONES[zoneIndex % ZONES.length];
  if (!z) throw new Error(`Invalid zone index: ${zoneIndex}`);
  return z;
}

/** How many times the zone list has wrapped around (0 for the first pass). */
export function zoneCycle(zoneIndex: number): number {
  return Math.floor(zoneIndex / ZONES.length);
}
