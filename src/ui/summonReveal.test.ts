import { describe, expect, it } from 'vitest';
import { chargeMs } from './summonReveal';

describe('summon reveal timing', () => {
  it('charges longer for rarer creatures', () => {
    expect(chargeMs('mythic', false)).toBeGreaterThan(chargeMs('legendary', false));
    expect(chargeMs('rare', false)).toBeGreaterThan(chargeMs('common', false));
  });

  it('keeps ×10 steps shorter than a single summon', () => {
    for (const r of ['common', 'rare', 'epic', 'legendary', 'mythic'] as const) {
      expect(chargeMs(r, true)).toBeLessThan(chargeMs(r, false));
    }
    // a full ×10 of mythics still finishes its charges in under 10 s
    expect(chargeMs('mythic', true) * 10).toBeLessThan(10_000);
  });
});
