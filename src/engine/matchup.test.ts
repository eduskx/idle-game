import { describe, expect, it } from 'vitest';
import { CREATURES } from '../data/creatures';
import { ZONES } from '../data/world';
import { matchupScore, zoneEnemyTypes, zoneMatchup } from './matchup';

const zoneIndex = (id: string) => ZONES.findIndex((z) => z.id === id);

describe('zone matchups', () => {
  it('lists the distinct enemy types of a zone', () => {
    const types = zoneEnemyTypes(zoneIndex('meadow'));
    expect(new Set(types).size).toBe(types.length);
    // Meadow: Mossling (Grove+Stone), Emberpup (Ember), Puddlefin (Tide)
    expect(types).toEqual(expect.arrayContaining(['grove', 'stone', 'ember', 'tide']));
  });

  it('rates Tide strong where Ember and Stone live, and Ember weak against Tide and Stone', () => {
    // Hearthtown: Emberpup, Teacup, Honeybear, boss Teacup
    expect(zoneMatchup(['tide'], zoneIndex('hearthtown'))).toBe('strong');
    // Meadow: Mossling (Grove+Stone), Emberpup, Puddlefin (Tide)
    expect(zoneMatchup(['ember'], zoneIndex('meadow'))).toBe('weak');
    expect(matchupScore(['gale'], zoneIndex('meadow'))).toBeLessThan(1);
  });

  it('every creature gets a matchup in every zone, and wraps for endless cycles', () => {
    for (const c of CREATURES) {
      for (let z = 0; z < ZONES.length; z++) {
        expect(['strong', 'weak', 'neutral']).toContain(zoneMatchup(c.types, z));
      }
      expect(zoneMatchup(c.types, ZONES.length)).toBe(zoneMatchup(c.types, 0));
    }
  });

  it('spreads the roster across all three labels', () => {
    const labels = new Set(CREATURES.flatMap((c) => ZONES.map((_, z) => zoneMatchup(c.types, z))));
    expect(labels).toEqual(new Set(['strong', 'weak', 'neutral']));
  });
});
