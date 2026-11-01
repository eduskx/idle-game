import { describe, expect, it } from 'vitest';
import { CREATURES } from '../../data/creatures';
import { spriteScale } from './Sprite';

describe('creature size classes', () => {
  it('gives every species a size class and uses at least four different ones', () => {
    const sizes = new Set(CREATURES.map((c) => c.size));
    expect(CREATURES.every((c) => c.size)).toBe(true);
    expect(sizes.size).toBeGreaterThanOrEqual(4);
  });

  it('scales battle actors by size class, relative to M', () => {
    expect(spriteScale('teacup', 'stage')).toBe(0.6);
    expect(spriteScale('hexcat', 'stage')).toBe(1);
    expect(spriteScale('eclipsewyrm', 'stage')).toBe(1.35);
  });

  it('keeps portraits inside their slot', () => {
    for (const c of CREATURES) {
      const s = spriteScale(c.id, 'portrait');
      expect(s).toBeGreaterThan(0.5);
      expect(s).toBeLessThanOrEqual(1);
    }
    expect(spriteScale('teacup', 'portrait')).toBeLessThan(spriteScale('honeybear', 'portrait'));
  });

  it('ignores scaling when asked and for unknown ids', () => {
    expect(spriteScale('eclipsewyrm', 'none')).toBe(1);
    expect(spriteScale('nope', 'stage')).toBe(1);
  });
});
