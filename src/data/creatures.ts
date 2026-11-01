import type { Ability, CreatureDef, CreatureLook, Element, Rarity, Realm } from '../engine/types';

/** Stat multiplier per rarity, applied to the archetype base stats. */
export const RARITY_MULT: Record<Rarity, number> = {
  common: 1,
  rare: 1.7,
  epic: 2.9,
  legendary: 5,
  mythic: 8.5,
};

export const RARITY_ORDER: Rarity[] = ['common', 'rare', 'epic', 'legendary', 'mythic'];

type Archetype = 'bruiser' | 'striker' | 'guardian' | 'support' | 'swift';

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
  look: CreatureLook,
): CreatureDef {
  const a = ARCHETYPES[archetype];
  const m = RARITY_MULT[rarity];
  return {
    id,
    realm,
    element,
    rarity,
    baseAtk: round2(5 * a.atk * m),
    baseHp: round2(40 * a.hp * m),
    speed: a.speed,
    ability,
    unlockZone,
    look,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The full creature roster. Names and descriptions live in the i18n dictionaries
 * (key: `creature.<id>.name`). Art can be overridden per id, see docs/ART_GUIDE.md.
 */
export const CREATURES: CreatureDef[] = [
  // ---------- HEARTH (cozy) ----------
  creature('mossling', 'hearth', 'grove', 'common', 'bruiser', { kind: 'none', value: 0 }, 0, {
    body: 'blob',
    ears: 'leaf',
    eyes: 'big',
    hue: 110,
    extra: 'none',
  }),
  creature('emberpup', 'hearth', 'ember', 'common', 'striker', { kind: 'crit', value: 0.05 }, 0, {
    body: 'round',
    ears: 'cat',
    eyes: 'big',
    hue: 22,
    extra: 'tail',
  }),
  creature('puddlefin', 'hearth', 'tide', 'common', 'guardian', { kind: 'taunt', value: 0.2 }, 0, {
    body: 'wide',
    ears: 'none',
    eyes: 'dot',
    hue: 200,
    extra: 'none',
  }),
  creature('teacup', 'hearth', 'tide', 'rare', 'support', { kind: 'teamHeal', value: 0.25 }, 0, {
    body: 'round',
    ears: 'none',
    eyes: 'sleepy',
    hue: 180,
    extra: 'halo',
  }),
  creature('bramblebun', 'hearth', 'grove', 'rare', 'swift', { kind: 'goldFind', value: 0.15 }, 0, {
    body: 'tall',
    ears: 'bunny',
    eyes: 'big',
    hue: 90,
    extra: 'tail',
  }),
  creature('hearthmouse', 'hearth', 'ember', 'rare', 'swift', { kind: 'haste', value: 0.08 }, 1, {
    body: 'round',
    ears: 'cat',
    eyes: 'dot',
    hue: 35,
    extra: 'tail',
  }),
  creature('capfolk', 'hearth', 'grove', 'epic', 'guardian', { kind: 'thorns', value: 0.3 }, 1, {
    body: 'tall',
    ears: 'none',
    eyes: 'sleepy',
    hue: 15,
    extra: 'mushroom',
  }),
  creature('dewdrake', 'hearth', 'tide', 'epic', 'striker', { kind: 'execute', value: 0.5 }, 2, {
    body: 'tall',
    ears: 'horns',
    eyes: 'big',
    hue: 190,
    extra: 'wings',
  }),
  creature('lanternmoth', 'hearth', 'ember', 'epic', 'support', { kind: 'xpFind', value: 0.25 }, 2, {
    body: 'round',
    ears: 'antlers',
    eyes: 'glow',
    hue: 45,
    extra: 'wings',
  }),
  creature('honeybear', 'hearth', 'grove', 'legendary', 'bruiser', { kind: 'lifesteal', value: 0.15 }, 3, {
    body: 'wide',
    ears: 'cat',
    eyes: 'sleepy',
    hue: 40,
    extra: 'none',
  }),
  creature('kettlekin', 'hearth', 'ember', 'legendary', 'support', { kind: 'essenceFind', value: 0.3 }, 4, {
    body: 'round',
    ears: 'none',
    eyes: 'big',
    hue: 10,
    extra: 'flame',
  }),
  creature('rainmother', 'hearth', 'tide', 'legendary', 'support', { kind: 'teamHeal', value: 0.6 }, 5, {
    body: 'tall',
    ears: 'leaf',
    eyes: 'sleepy',
    hue: 210,
    extra: 'halo',
  }),
  creature('elderoak', 'hearth', 'grove', 'mythic', 'guardian', { kind: 'taunt', value: 0.6 }, 6, {
    body: 'tall',
    ears: 'antlers',
    eyes: 'sleepy',
    hue: 100,
    extra: 'mushroom',
  }),
  creature('sunhare', 'hearth', 'ember', 'mythic', 'swift', { kind: 'haste', value: 0.15 }, 8, {
    body: 'tall',
    ears: 'bunny',
    eyes: 'glow',
    hue: 50,
    extra: 'halo',
  }),
  creature('tidewhale', 'hearth', 'tide', 'mythic', 'bruiser', { kind: 'goldFind', value: 0.5 }, 10, {
    body: 'wide',
    ears: 'none',
    eyes: 'big',
    hue: 220,
    extra: 'tail',
  }),

  // ---------- UMBRA (dark fantasy) ----------
  creature('gloomwisp', 'umbra', 'ember', 'common', 'swift', { kind: 'none', value: 0 }, 0, {
    body: 'blob',
    ears: 'none',
    eyes: 'glow',
    hue: 280,
    extra: 'flame',
  }),
  creature('bonecrow', 'umbra', 'grove', 'common', 'striker', { kind: 'execute', value: 0.3 }, 0, {
    body: 'round',
    ears: 'horns',
    eyes: 'dot',
    hue: 260,
    extra: 'wings',
  }),
  creature('mirelurk', 'umbra', 'tide', 'common', 'bruiser', { kind: 'lifesteal', value: 0.05 }, 0, {
    body: 'wide',
    ears: 'none',
    eyes: 'three',
    hue: 160,
    extra: 'none',
  }),
  creature('hexcat', 'umbra', 'ember', 'rare', 'striker', { kind: 'crit', value: 0.12 }, 0, {
    body: 'round',
    ears: 'cat',
    eyes: 'glow',
    hue: 300,
    extra: 'tail',
  }),
  creature('cryptling', 'umbra', 'grove', 'rare', 'guardian', { kind: 'thorns', value: 0.2 }, 0, {
    body: 'spiky',
    ears: 'horns',
    eyes: 'dot',
    hue: 240,
    extra: 'none',
  }),
  creature('drownedknight', 'umbra', 'tide', 'rare', 'guardian', { kind: 'taunt', value: 0.3 }, 1, {
    body: 'tall',
    ears: 'horns',
    eyes: 'glow',
    hue: 190,
    extra: 'none',
  }),
  creature('ashwraith', 'umbra', 'ember', 'epic', 'striker', { kind: 'rage', value: 0.1 }, 1, {
    body: 'tall',
    ears: 'none',
    eyes: 'glow',
    hue: 5,
    extra: 'flame',
  }),
  creature('rotmaw', 'umbra', 'grove', 'epic', 'bruiser', { kind: 'bossSlayer', value: 0.4 }, 2, {
    body: 'spiky',
    ears: 'antlers',
    eyes: 'three',
    hue: 75,
    extra: 'none',
  }),
  creature('voidmoth', 'umbra', 'tide', 'epic', 'support', { kind: 'essenceFind', value: 0.2 }, 2, {
    body: 'round',
    ears: 'antlers',
    eyes: 'glow',
    hue: 250,
    extra: 'wings',
  }),
  creature('gravewarden', 'umbra', 'grove', 'legendary', 'guardian', { kind: 'thorns', value: 0.6 }, 3, {
    body: 'wide',
    ears: 'horns',
    eyes: 'glow',
    hue: 140,
    extra: 'halo',
  }),
  creature('nightmare', 'umbra', 'ember', 'legendary', 'swift', { kind: 'rage', value: 0.2 }, 4, {
    body: 'tall',
    ears: 'horns',
    eyes: 'glow',
    hue: 330,
    extra: 'flame',
  }),
  creature('abysshorror', 'umbra', 'tide', 'legendary', 'striker', { kind: 'bossSlayer', value: 0.8 }, 5, {
    body: 'spiky',
    ears: 'none',
    eyes: 'three',
    hue: 230,
    extra: 'tail',
  }),
  creature('lichbloom', 'umbra', 'grove', 'mythic', 'support', { kind: 'xpFind', value: 0.6 }, 6, {
    body: 'tall',
    ears: 'leaf',
    eyes: 'glow',
    hue: 290,
    extra: 'mushroom',
  }),
  creature('cinderking', 'umbra', 'ember', 'mythic', 'striker', { kind: 'crit', value: 0.25 }, 8, {
    body: 'spiky',
    ears: 'horns',
    eyes: 'glow',
    hue: 0,
    extra: 'halo',
  }),
  creature('eclipsewyrm', 'umbra', 'tide', 'mythic', 'bruiser', { kind: 'execute', value: 1 }, 10, {
    body: 'tall',
    ears: 'horns',
    eyes: 'three',
    hue: 270,
    extra: 'wings',
  }),
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
