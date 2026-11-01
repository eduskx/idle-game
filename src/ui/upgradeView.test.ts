import { describe, expect, it } from 'vitest';
import { upgradeView } from './upgradeView';

describe('upgrade card preview', () => {
  it('shows the multiplier now and after the next level', () => {
    const v = upgradeView('sharpen', 0);
    expect(v.now).toBe(1);
    expect(v.next).toBeCloseTo(1.2);
    expect(v.milestone).toEqual({ at: 25, into: 0, left: 25 });
  });

  it('counts down to the next ×2 milestone and doubles on it', () => {
    const v = upgradeView('greed', 24);
    expect(v.milestone).toEqual({ at: 25, into: 24, left: 1 });
    expect(v.next / v.now).toBeGreaterThan(2);
    expect(upgradeView('greed', 25).milestone).toEqual({ at: 50, into: 0, left: 25 });
  });

  it('shows flat bonuses for crit, speed and team slots', () => {
    expect(upgradeView('focus', 7)).toMatchObject({ effect: 'crit', now: 7, next: 8 });
    expect(upgradeView('swiftness', 3)).toMatchObject({ effect: 'speed', now: 6, next: 8 });
    expect(upgradeView('pack', 1)).toMatchObject({ effect: 'slots', now: 1, next: 2 });
    expect(upgradeView('pack', 1).milestone).toBeUndefined();
  });
});
