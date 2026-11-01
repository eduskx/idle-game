import {
  AVATAR_HAIR_COLORS,
  AVATAR_ITEMS,
  AVATAR_SKIN_TONES,
  AVATAR_SLOTS,
  avatarItem,
  DEFAULT_AVATAR,
  type AvatarItemDef,
} from '../data/avatar';
import type { AvatarSlot, AvatarState, GameState } from './types';

export function defaultAvatar(): AvatarState {
  return {
    skin: DEFAULT_AVATAR.skin,
    hairColor: DEFAULT_AVATAR.hairColor,
    items: { ...DEFAULT_AVATAR.items },
  };
}

export function isItemUnlocked(s: GameState, item: AvatarItemDef): boolean {
  const u = item.unlock;
  switch (u.kind) {
    case 'start':
      return true;
    case 'achievement':
      return s.achievements.includes(u.id);
    case 'stage':
      return s.lifetime.highestStage >= u.stage;
    case 'rebloom':
      return s.lifetime.reblooms >= u.count;
  }
}

/** Progress towards an item's unlock as [current, target]; achievements are 0/1. */
export function unlockProgress(s: GameState, item: AvatarItemDef): [number, number] {
  const u = item.unlock;
  switch (u.kind) {
    case 'start':
      return [1, 1];
    case 'achievement':
      return [s.achievements.includes(u.id) ? 1 : 0, 1];
    case 'stage':
      return [Math.min(s.lifetime.highestStage, u.stage), u.stage];
    case 'rebloom':
      return [Math.min(s.lifetime.reblooms, u.count), u.count];
  }
}

/** Keys (`slot:id`) of every unlocked item, used to announce new unlocks. */
export function unlockedItemKeys(s: GameState): string[] {
  return AVATAR_ITEMS.filter((i) => isItemUnlocked(s, i)).map((i) => `${i.slot}:${i.id}`);
}

/** Equips an item if it exists and is unlocked. Returns whether anything changed. */
export function equipAvatarItem(s: GameState, slot: AvatarSlot, id: string): boolean {
  const item = avatarItem(slot, id);
  if (!item || !isItemUnlocked(s, item) || s.avatar.items[slot] === id) return false;
  s.avatar.items[slot] = id;
  return true;
}

export function setAvatarColor(s: GameState, kind: 'skin' | 'hairColor', index: number): boolean {
  const max = kind === 'skin' ? AVATAR_SKIN_TONES.length : AVATAR_HAIR_COLORS.length;
  if (!Number.isInteger(index) || index < 0 || index >= max || s.avatar[kind] === index) return false;
  s.avatar[kind] = index;
  return true;
}

/**
 * Repairs avatar data from a save: unknown or still-locked items fall back to the
 * default, out-of-range colors to the default tone.
 */
export function sanitizeAvatar(s: GameState, raw: Partial<AvatarState> | undefined): AvatarState {
  const out = defaultAvatar();
  if (!raw) return out;
  if (typeof raw.skin === 'number' && raw.skin >= 0 && raw.skin < AVATAR_SKIN_TONES.length)
    out.skin = raw.skin;
  if (typeof raw.hairColor === 'number' && raw.hairColor >= 0 && raw.hairColor < AVATAR_HAIR_COLORS.length) {
    out.hairColor = raw.hairColor;
  }
  for (const slot of AVATAR_SLOTS) {
    const id = raw.items?.[slot];
    const item = id === undefined ? undefined : avatarItem(slot, id);
    if (item && isItemUnlocked(s, item)) out.items[slot] = item.id;
  }
  return out;
}
