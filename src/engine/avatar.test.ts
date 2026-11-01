import { describe, expect, it } from 'vitest';
import { AVATAR_ITEMS, AVATAR_SLOTS, avatarItem, itemsForSlot, OPTIONAL_SLOTS } from '../data/avatar';
import { ACHIEVEMENTS } from '../data/progression';
import {
  createInitialState,
  defaultAvatar,
  equipAvatarItem,
  isItemUnlocked,
  setAvatarColor,
  unlockedItemKeys,
  unlockProgress,
} from './index';

describe('avatar wardrobe', () => {
  it('has unique ids per slot, a hearth and an umbra piece per slot, and valid unlocks', () => {
    const achievementIds = new Set(ACHIEVEMENTS.map((a) => a.id));
    for (const slot of AVATAR_SLOTS) {
      const items = itemsForSlot(slot);
      expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
      expect(items.some((i) => i.realm === 'hearth')).toBe(true);
      expect(items.some((i) => i.realm === 'umbra')).toBe(true);
      expect(items.length).toBeGreaterThanOrEqual(4);
      if (OPTIONAL_SLOTS.includes(slot)) expect(avatarItem(slot, 'none')?.unlock.kind).toBe('start');
    }
    for (const item of AVATAR_ITEMS) {
      if (item.unlock.kind === 'achievement') expect(achievementIds.has(item.unlock.id)).toBe(true);
    }
  });

  it('starts with the default outfit, all of it unlocked', () => {
    const s = createInitialState(1000, 9);
    expect(s.avatar).toEqual(defaultAvatar());
    for (const slot of AVATAR_SLOTS) {
      expect(isItemUnlocked(s, avatarItem(slot, s.avatar.items[slot])!)).toBe(true);
    }
  });

  it('unlocks items through achievements, stages and reblooms (no costs)', () => {
    const s = createInitialState(1000, 9);
    const gold = s.currencies.gold;
    expect(equipAvatarItem(s, 'top', 'knit')).toBe(false);
    s.achievements.push('pureHearth');
    expect(equipAvatarItem(s, 'top', 'knit')).toBe(true);
    expect(s.avatar.items.top).toBe('knit');

    const crescent = avatarItem('hat', 'crescent')!;
    s.lifetime.highestStage = 120;
    expect(unlockProgress(s, crescent)).toEqual([120, 250]);
    expect(isItemUnlocked(s, crescent)).toBe(false);
    s.lifetime.highestStage = 250;
    expect(isItemUnlocked(s, crescent)).toBe(true);

    const before = unlockedItemKeys(s).length;
    s.lifetime.reblooms = 3;
    expect(unlockedItemKeys(s).length).toBe(before + 3); // nightwrap, sprout, mothpin
    expect(s.currencies.gold).toBe(gold);
  });

  it('rejects unknown items and out-of-range colors', () => {
    const s = createInitialState(1000, 9);
    expect(equipAvatarItem(s, 'hat', 'crown')).toBe(false);
    expect(equipAvatarItem(s, 'top', 'none')).toBe(false);
    expect(setAvatarColor(s, 'skin', 99)).toBe(false);
    expect(setAvatarColor(s, 'hairColor', 5)).toBe(true);
    expect(s.avatar.hairColor).toBe(5);
  });
});
