import type { Ability, CreatureDef, Element, Rarity, Realm } from '../engine/types';

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
  element: Element,
  rarity: Rarity,
  archetype: Archetype,
  ability: Ability,
  unlockZone: number,
): CreatureDef {
  const a = ARCHETYPES[archetype];
  const m = RARITY_MULT[rarity];
  return {
    id,
    realm,
    element,
    rarity,
    archetype,
    baseAtk: round2(5 * a.atk * m),
    baseHp: round2(40 * a.hp * m),
    speed: a.speed,
    ability,
    unlockZone,
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
  creature('mossling', 'hearth', 'grove', 'common', 'guardian', { kind: 'taunt', value: 0.3 }, 0),
  // Red-panda kit whose ringed tail glows like embers.
  creature('emberpup', 'hearth', 'ember', 'common', 'striker', { kind: 'crit', value: 0.08 }, 0),
  // Round otter wearing a lily-pad hat, collects shiny pebbles.
  creature('puddlefin', 'hearth', 'tide', 'rare', 'support', { kind: 'goldFind', value: 0.2 }, 0),
  // Tiny steam spirit living in a teacup.
  creature('teacup', 'hearth', 'tide', 'epic', 'support', { kind: 'teamHeal', value: 0.45 }, 1),
  // Bear cub in honeycomb armor, escorted by bees.
  creature('honeybear', 'hearth', 'grove', 'legendary', 'bruiser', { kind: 'lifesteal', value: 0.15 }, 3),

  // ---------- UMBRA (dark fantasy) ----------
  // Moth-winged will-o'-wisp with a hollow lantern body.
  creature('gloomwisp', 'umbra', 'ember', 'common', 'swift', { kind: 'haste', value: 0.08 }, 0),
  // Crow wearing a skull mask, thorny tail feathers.
  creature('bonecrow', 'umbra', 'grove', 'common', 'striker', { kind: 'execute', value: 0.4 }, 0),
  // Black cat with three violet-flame tails and a rune collar.
  creature('hexcat', 'umbra', 'ember', 'rare', 'striker', { kind: 'rage', value: 0.12 }, 0),
  // Hermit crab knight living in a sunken helmet.
  creature('drownedknight', 'umbra', 'tide', 'epic', 'guardian', { kind: 'thorns', value: 0.4 }, 1),
  // Abyssal sea serpent crowned by an eclipse ring.
  creature('eclipsewyrm', 'umbra', 'tide', 'legendary', 'striker', { kind: 'bossSlayer', value: 0.8 }, 3),
];

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
