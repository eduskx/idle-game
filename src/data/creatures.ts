import type { Ability, CreatureDef, CreatureType, Rarity, Realm, SizeClass } from '../engine/types';

/** Stat multiplier per rarity, applied to the archetype base stats. */
export const RARITY_MULT: Record<Rarity, number> = {
  common: 1,
  rare: 1.7,
  epic: 2.9,
  legendary: 5,
  mythic: 8.5,
};

export const RARITY_ORDER: Rarity[] = ['common', 'rare', 'epic', 'legendary', 'mythic'];

export type Archetype = 'bruiser' | 'striker' | 'guardian' | 'support' | 'swift';

const ARCHETYPES: Record<Archetype, { atk: number; hp: number; speed: number }> = {
  bruiser: { atk: 1.0, hp: 1.2, speed: 1.0 },
  striker: { atk: 1.45, hp: 0.75, speed: 0.9 },
  guardian: { atk: 0.6, hp: 2.0, speed: 0.8 },
  support: { atk: 0.75, hp: 1.0, speed: 1.0 },
  swift: { atk: 0.7, hp: 0.8, speed: 1.6 },
};

function creature(
  id: string,
  realm: Realm,
  types: readonly CreatureType[],
  rarity: Rarity,
  archetype: Archetype,
  ability: Ability,
  unlockZone: number,
  size: SizeClass,
): CreatureDef {
  const a = ARCHETYPES[archetype];
  const m = RARITY_MULT[rarity];
  return {
    id,
    realm,
    types,
    rarity,
    archetype,
    baseAtk: round2(5 * a.atk * m),
    baseHp: round2(40 * a.hp * m),
    speed: a.speed,
    ability,
    unlockZone,
    size,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The creature roster: 10 hand-designed species, 5 per realm. Each one is built on a
 * distinct animal/object base so silhouettes stay readable at small sizes. Art lives
 * in src/ui/creatures/, names in the i18n dictionaries (`creature.<id>`).
 */
export const CREATURES: CreatureDef[] = [
  // ---------- HEARTH (cozy) ----------
  // Hedgehog with a moss-and-mushroom back. Round, sturdy, friendly front-liner.
  creature(
    'mossling',
    'hearth',
    ['grove', 'stone'],
    'common',
    'guardian',
    { kind: 'taunt', value: 0.3 },
    0,
    'S',
  ),
  // Red-panda kit whose ringed tail glows like embers.
  creature('emberpup', 'hearth', ['ember'], 'common', 'striker', { kind: 'crit', value: 0.08 }, 0, 'S'),
  // Round otter wearing a lily-pad hat, collects shiny pebbles.
  creature('puddlefin', 'hearth', ['tide'], 'rare', 'support', { kind: 'goldFind', value: 0.2 }, 0, 'M'),
  // Tiny steam spirit living in a teacup.
  creature(
    'teacup',
    'hearth',
    ['tide', 'ember'],
    'epic',
    'support',
    { kind: 'teamHeal', value: 0.45 },
    1,
    'XS',
  ),
  // Bear cub in honeycomb armor, escorted by bees.
  creature(
    'honeybear',
    'hearth',
    ['grove', 'gale'],
    'legendary',
    'bruiser',
    { kind: 'lifesteal', value: 0.15 },
    3,
    'L',
  ),

  // ---------- UMBRA (dark fantasy) ----------
  // Moth-winged will-o'-wisp with a hollow lantern body.
  creature(
    'gloomwisp',
    'umbra',
    ['shade', 'ember'],
    'common',
    'swift',
    { kind: 'haste', value: 0.08 },
    0,
    'S',
  ),
  // Crow wearing a skull mask, thorny tail feathers.
  creature(
    'bonecrow',
    'umbra',
    ['shade', 'gale'],
    'common',
    'striker',
    { kind: 'execute', value: 0.4 },
    0,
    'M',
  ),
  // Black cat with three violet-flame tails and a rune collar.
  creature('hexcat', 'umbra', ['shade'], 'rare', 'striker', { kind: 'rage', value: 0.12 }, 0, 'M'),
  // Hermit crab knight living in a sunken helmet.
  creature(
    'drownedknight',
    'umbra',
    ['tide', 'stone'],
    'epic',
    'guardian',
    { kind: 'thorns', value: 0.4 },
    1,
    'L',
  ),
  // Abyssal sea serpent crowned by an eclipse ring.
  creature(
    'eclipsewyrm',
    'umbra',
    ['tide', 'shade'],
    'legendary',
    'striker',
    { kind: 'bossSlayer', value: 0.8 },
    3,
    'XL',
  ),
];

/** Rendered scale per size class on the battle stage, relative to M (see CREATURE_BIBLE.md). */
export const SIZE_SCALE: Record<SizeClass, number> = { XS: 0.6, S: 0.8, M: 1, L: 1.2, XL: 1.35 };

/**
 * Portraits live in fixed slots, so the spread is compressed and capped at the slot size:
 * small species still read as small, big ones fill the slot without overflowing.
 */
export const PORTRAIT_SCALE: Record<SizeClass, number> = { XS: 0.7, S: 0.82, M: 0.9, L: 1, XL: 1 };

export const CREATURE_BY_ID: Record<string, CreatureDef> = Object.fromEntries(
  CREATURES.map((c) => [c.id, c]),
);

export function getCreature(id: string): CreatureDef {
  const def = CREATURE_BY_ID[id];
  if (!def) throw new Error(`Unknown creature: ${id}`);
  return def;
}

/** The two creatures every new player starts with: one per realm. */
export const STARTER_CREATURES = ['mossling', 'gloomwisp'] as const;
