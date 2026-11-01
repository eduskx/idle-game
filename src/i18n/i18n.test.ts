import { describe, expect, it } from 'vitest';
import { AVATAR_ITEMS } from '../data/avatar';
import { CREATURES } from '../data/creatures';
import { ACHIEVEMENTS, TALENTS, UPGRADES } from '../data/progression';
import { ZONES } from '../data/world';
import { de } from './de';
import { en } from './en';
import { formatNumber, translate } from '.';

function leafKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : leafKeys(v as object, `${prefix}${k}.`),
  );
}

describe('i18n', () => {
  it('German has exactly the same keys as English', () => {
    expect(leafKeys(de).sort()).toEqual(leafKeys(en).sort());
  });

  it('every content id has a name in both languages', () => {
    const keys = [
      ...CREATURES.map((c) => `creature.${c.id}`),
      ...ZONES.map((z) => `zone.${z.id}`),
      ...UPGRADES.map((u) => `upgrade.${u.id}.name`),
      ...TALENTS.map((t) => `talent.${t.id}.name`),
      ...ACHIEVEMENTS.map((a) => `achievement.${a.id}`),
      ...AVATAR_ITEMS.map((i) => `avatar.item.${i.slot}.${i.id}`),
    ];
    for (const key of keys) {
      expect(translate('en', key), key).not.toBe(key);
      expect(translate('de', key), key).not.toBe(key);
    }
  });

  it('interpolates params', () => {
    expect(translate('en', 'battle.stage', { stage: 5 })).toBe('Stage 5');
  });

  it('formats large numbers', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1500)).toBe('1.50K');
    expect(formatNumber(2.5e9)).toBe('2.50B');
    expect(formatNumber(1e60)).toMatch(/e60$/);
  });
});
