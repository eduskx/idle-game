import { describe, expect, it } from 'vitest';
import { createInitialState, globalModifiers, memberStats, simulate, typeCharmBonus } from '../engine';
import { exportSave, fromUnknown, importSave, SaveError, toSaveData } from './serialize';
import { MemoryRepository } from './repository';

describe('persistence', () => {
  it('round-trips a played state through export/import', () => {
    const s = createInitialState(1000, 9);
    simulate(s, 120);
    const restored = importSave(exportSave(s));
    expect(toSaveData(restored)).toEqual(toSaveData(s));
  });

  it('rejects tampered export strings', () => {
    const code = exportSave(createInitialState(1000, 9));
    const tampered = code.slice(0, -4) + 'AAAA';
    expect(() => importSave(tampered)).toThrow(SaveError);
  });

  it('rejects garbage and invalid values', () => {
    expect(() => importSave('hello')).toThrow(SaveError);
    const data = toSaveData(createInitialState(1000, 9)) as Record<string, unknown>;
    expect(() => fromUnknown({ ...data, currencies: { gold: -1, essence: 0, seeds: 0 } })).toThrow(SaveError);
    expect(() => fromUnknown({ ...data, currencies: { gold: Infinity, essence: 0, seeds: 0 } })).toThrow(
      SaveError,
    );
    expect(() => fromUnknown(null)).toThrow(SaveError);
  });

  it('drops unknown creatures instead of crashing', () => {
    const data = toSaveData(createInitialState(1000, 9));
    data.creatures.ghostcreature = { defId: 'ghostcreature', level: 1, xp: 0, stars: 0, shards: 0 };
    data.team.push('ghostcreature');
    const s = fromUnknown(data);
    expect(s.creatures.ghostcreature).toBeUndefined();
    expect(s.team).not.toContain('ghostcreature');
  });

  it('repairs saves whose team only had removed creatures', () => {
    const data = toSaveData(createInitialState(1000, 9));
    data.creatures = { oldcreature: { defId: 'oldcreature', level: 5, xp: 0, stars: 1, shards: 0 } };
    data.team = ['oldcreature'];
    const s = fromUnknown(data);
    expect(s.team).toEqual(['mossling', 'gloomwisp']);
    expect(Object.keys(s.creatures).sort()).toEqual(['gloomwisp', 'mossling']);
  });

  it('loads saves from before the type system (element cores keep working)', () => {
    const data = toSaveData(createInitialState(1000, 9));
    data.charms = { groveCore: 2, emberCore: 1, tideCore: 0 };
    data.battle = { stage: 14, autoAdvance: true };
    const s = fromUnknown(JSON.parse(JSON.stringify(data)));
    // Mossling is Grove + Stone, Gloomwisp is Shade + Ember.
    expect(typeCharmBonus(s, ['grove', 'stone'])).toBeCloseTo(0.12);
    expect(typeCharmBonus(s, ['shade', 'ember'])).toBeCloseTo(0.06);
    expect(memberStats(s, 'mossling', globalModifiers(s)).types).toEqual(['grove', 'stone']);
    simulate(s, 10);
    expect(s.battle.enemy?.types.length).toBeGreaterThan(0);
  });

  it('saves and loads through a repository', async () => {
    const repo = new MemoryRepository();
    expect(await repo.load()).toBeNull();
    const s = createInitialState(1000, 9);
    await repo.save(s);
    expect((await repo.load())?.rngState).toBe(s.rngState);
  });
});
