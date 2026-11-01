import { describe, expect, it } from 'vitest';
import { CREATURE_BY_ID, SIZE_SCALE } from '../data/creatures';
import { HUB_MAX, hubLayout } from './hubLayout';

const RANK = { XS: 0, S: 1, M: 2, L: 3, XL: 4 } as const;
const rank = (id: string) => RANK[CREATURE_BY_ID[id]!.size];

const TEAMS = [
  ['mossling'],
  ['eclipsewyrm', 'teacup'],
  ['teacup', 'eclipsewyrm', 'emberpup'],
  ['eclipsewyrm', 'teacup', 'honeybear', 'emberpup'],
  ['teacup', 'eclipsewyrm', 'mossling', 'honeybear', 'bonecrow'],
  ['eclipsewyrm', 'teacup', 'honeybear', 'emberpup', 'drownedknight', 'puddlefin'],
  ['hexcat', 'gloomwisp', 'bonecrow', 'puddlefin', 'mossling', 'emberpup'],
];

describe('hubLayout', () => {
  it('places every member once, in team order, up to the max', () => {
    for (const team of TEAMS) {
      const out = hubLayout(team);
      expect(out.map((p) => p.id)).toEqual(team);
      expect(out.map((p) => p.index)).toEqual(team.map((_, i) => i));
    }
    const many = [...TEAMS[6]!, 'teacup'];
    expect(hubLayout(many)).toHaveLength(HUB_MAX);
  });

  it('never puts a bigger species in front of a smaller one', () => {
    for (const team of TEAMS) {
      const out = hubLayout(team);
      for (const a of out)
        for (const b of out) {
          if (rank(a.id) > rank(b.id)) expect(a.bottom).toBeGreaterThanOrEqual(b.bottom);
        }
    }
  });

  it('draws nearer rows on top and the smaller creature on top within a row', () => {
    for (const team of TEAMS) {
      const out = hubLayout(team);
      for (const a of out)
        for (const b of out) {
          if (a.bottom < b.bottom) expect(a.zIndex).toBeGreaterThan(b.zIndex);
          if (a.bottom === b.bottom && rank(a.id) < rank(b.id)) expect(a.zIndex).toBeGreaterThan(b.zIndex);
        }
    }
  });

  it('keeps sprites inside the scene and back rows smaller', () => {
    const width = 358;
    for (const team of TEAMS) {
      const out = hubLayout(team, width);
      for (const p of out) {
        const half = ((p.size * SIZE_SCALE[CREATURE_BY_ID[p.id]!.size]) / 2 / width) * 100;
        expect(p.x - half).toBeGreaterThanOrEqual(-0.1);
        expect(p.x + half).toBeLessThanOrEqual(100.1);
      }
      const front = out.filter((p) => p.depth === 'front');
      const back = out.filter((p) => p.depth === 'back');
      for (const f of front) for (const b of back) expect(b.size).toBeLessThan(f.size);
    }
  });

  it('gives a front creature only a small overlap with the one behind it', () => {
    // A creature right in front of another may cover at most the lower third of it.
    for (const team of TEAMS) {
      const out = hubLayout(team);
      for (const f of out)
        for (const b of out) {
          if (f.bottom >= b.bottom) continue;
          const fHalf = (f.size * SIZE_SCALE[CREATURE_BY_ID[f.id]!.size] * 0.5 * 100) / 358;
          const bHalf = (b.size * SIZE_SCALE[CREATURE_BY_ID[b.id]!.size] * 0.5 * 100) / 358;
          if (Math.abs(f.x - b.x) >= (fHalf + bHalf) * 0.7) continue; // side by side, not in front
          const fTop = f.bottom + f.size * SIZE_SCALE[CREATURE_BY_ID[f.id]!.size];
          const bHeight = b.size * SIZE_SCALE[CREATURE_BY_ID[b.id]!.size];
          expect(fTop - b.bottom).toBeLessThanOrEqual(bHeight / 3 + 1);
        }
    }
  });
});
