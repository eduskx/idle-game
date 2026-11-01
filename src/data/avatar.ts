import type { AvatarSlot, Realm } from '../engine/types';

/**
 * Player avatar wardrobe. Every item is earned through existing milestones; there is
 * no shop and nothing costs currency. Art lives in src/ui/avatar/.
 */
export type AvatarUnlock =
  | { kind: 'start' }
  /** An achievement id from data/progression.ts. */
  | { kind: 'achievement'; id: string }
  /** Highest stage ever reached. */
  | { kind: 'stage'; stage: number }
  /** Number of reblooms done. */
  | { kind: 'rebloom'; count: number };

export interface AvatarItemDef {
  id: string;
  slot: AvatarSlot;
  unlock: AvatarUnlock;
  /** Realm style set, if the item belongs to one. */
  realm?: Realm;
  /** Main, shade and detail color, exposed to the art as --av-<slot>-1/2/3. */
  colors?: readonly [string, string, string];
}

export const AVATAR_SLOTS: readonly AvatarSlot[] = ['hair', 'top', 'bottom', 'shoes', 'hat', 'accessory'];

/** Slots that may stay empty ('none'). */
export const OPTIONAL_SLOTS: readonly AvatarSlot[] = ['hat', 'accessory'];

const start: AvatarUnlock = { kind: 'start' };

export const AVATAR_ITEMS: readonly AvatarItemDef[] = [
  // hair (colors come from the hair palette)
  { id: 'short', slot: 'hair', unlock: start },
  { id: 'bob', slot: 'hair', unlock: start },
  { id: 'braids', slot: 'hair', unlock: start },
  { id: 'bun', slot: 'hair', unlock: { kind: 'achievement', id: 'collect5' }, realm: 'hearth' },
  { id: 'veil', slot: 'hair', unlock: { kind: 'stage', stage: 100 }, realm: 'umbra' },

  // tops
  { id: 'tee', slot: 'top', unlock: start, colors: ['#f2c94c', '#c99a1e', '#fff3c4'] },
  {
    id: 'vest',
    slot: 'top',
    unlock: { kind: 'achievement', id: 'boss1' },
    colors: ['#5b8c5a', '#3a6040', '#e8dcc0'],
  },
  {
    id: 'knit',
    slot: 'top',
    unlock: { kind: 'achievement', id: 'pureHearth' },
    realm: 'hearth',
    colors: ['#e9875a', '#b85a35', '#fff0d8'],
  },
  {
    id: 'shroud',
    slot: 'top',
    unlock: { kind: 'achievement', id: 'pureUmbra' },
    realm: 'umbra',
    colors: ['#3b2f5c', '#211a38', '#4de2c4'],
  },

  // bottoms
  { id: 'shorts', slot: 'bottom', unlock: start, colors: ['#4f6fa8', '#344c7a', '#9fb7e0'] },
  { id: 'trousers', slot: 'bottom', unlock: start, colors: ['#6b5040', '#4a362a', '#a88a70'] },
  {
    id: 'patchskirt',
    slot: 'bottom',
    unlock: { kind: 'stage', stage: 25 },
    realm: 'hearth',
    colors: ['#c7584a', '#93382e', '#f2d27a'],
  },
  {
    id: 'nightwrap',
    slot: 'bottom',
    unlock: { kind: 'rebloom', count: 1 },
    realm: 'umbra',
    colors: ['#2a2440', '#16122a', '#a77bff'],
  },

  // shoes
  { id: 'sneakers', slot: 'shoes', unlock: start, colors: ['#f4f1ea', '#c9c2b4', '#e65a4f'] },
  {
    id: 'boots',
    slot: 'shoes',
    unlock: { kind: 'stage', stage: 50 },
    colors: ['#7a4a2a', '#4e2d18', '#c99a5a'],
  },
  {
    id: 'slippers',
    slot: 'shoes',
    unlock: { kind: 'achievement', id: 'kills100' },
    realm: 'hearth',
    colors: ['#f0b37e', '#c47f4a', '#fff1dc'],
  },
  {
    id: 'clawboots',
    slot: 'shoes',
    unlock: { kind: 'achievement', id: 'boss100' },
    realm: 'umbra',
    colors: ['#2b2338', '#130f1e', '#c7c0d8'],
  },

  // hats
  { id: 'none', slot: 'hat', unlock: start },
  {
    id: 'bobble',
    slot: 'hat',
    unlock: { kind: 'achievement', id: 'summon10' },
    realm: 'hearth',
    colors: ['#d9544d', '#a8352f', '#fff6ea'],
  },
  {
    id: 'sprout',
    slot: 'hat',
    unlock: { kind: 'rebloom', count: 1 },
    colors: ['#6fd16a', '#3d8a47', '#ffb3d1'],
  },
  {
    id: 'crescent',
    slot: 'hat',
    unlock: { kind: 'stage', stage: 250 },
    realm: 'umbra',
    colors: ['#2d2448', '#17122b', '#f5d76e'],
  },

  // accessories
  { id: 'none', slot: 'accessory', unlock: start },
  { id: 'glasses', slot: 'accessory', unlock: start, colors: ['#3b2a20', '#3b2a20', '#bfe6ff'] },
  {
    id: 'scarf',
    slot: 'accessory',
    unlock: { kind: 'achievement', id: 'stage10' },
    realm: 'hearth',
    colors: ['#3d8a47', '#24602f', '#f2d27a'],
  },
  {
    id: 'mothpin',
    slot: 'accessory',
    unlock: { kind: 'rebloom', count: 3 },
    realm: 'umbra',
    colors: ['#a77bff', '#6a45c9', '#ffd98a'],
  },
];

export function avatarItem(slot: AvatarSlot, id: string): AvatarItemDef | undefined {
  return AVATAR_ITEMS.find((i) => i.slot === slot && i.id === id);
}

export function itemsForSlot(slot: AvatarSlot): AvatarItemDef[] {
  return AVATAR_ITEMS.filter((i) => i.slot === slot);
}

/** Light, base, shade per skin tone. All free from the start. */
export const AVATAR_SKIN_TONES: readonly (readonly [string, string])[] = [
  ['#ffe0c7', '#e8b896'],
  ['#f6c9a0', '#d9a274'],
  ['#e0a774', '#bb7f4f'],
  ['#b9784a', '#8f5530'],
  ['#8a5432', '#64381d'],
  ['#5c3720', '#3e2312'],
];

/** Base and shade per hair color. All free from the start. */
export const AVATAR_HAIR_COLORS: readonly (readonly [string, string])[] = [
  ['#3a2a22', '#21160f'],
  ['#7a4a2a', '#4e2d18'],
  ['#d9a35a', '#a8752f'],
  ['#c4503a', '#8e3122'],
  ['#e8e2d6', '#b8b0a0'],
  ['#4a3a8c', '#2c2058'],
  ['#3d9a8a', '#246a5e'],
  ['#e88aa8', '#b85a78'],
];

export const DEFAULT_AVATAR = {
  skin: 1,
  hairColor: 1,
  items: { hair: 'short', top: 'tee', bottom: 'shorts', shoes: 'sneakers', hat: 'none', accessory: 'none' },
} as const;
