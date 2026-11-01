import { describe, expect, it } from 'vitest';
import { ZONES } from '../../data/world';
import { SCENERY_ZONES } from './ZoneScenery';

describe('zone scenery', () => {
  it('gives every zone its own backdrop', () => {
    expect([...SCENERY_ZONES].sort()).toEqual(ZONES.map((z) => z.id).sort());
  });
});
