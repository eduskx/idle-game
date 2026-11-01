import { describe, expect, it } from 'vitest';
import {
  canStartExpedition,
  claimExpedition,
  createInitialState,
  expeditionRemaining,
  globalModifiers,
  grantRandomCharm,
  recallExpedition,
  startExpedition,
  toggleTeamMember,
  type GameState,
} from '.';
import { newOwnedCreature } from './state';
import { migrate } from '../persistence/migrations';
import { fromUnknown, toSaveData } from '../persistence/serialize';

function withBench(): GameState {
  const s = createInitialState(0, 3);
  s.lifetime.highestStage = 30;
  s.runHighestStage = 30;
  s.creatures.hexcat = newOwnedCreature('hexcat');
  return s;
}

describe('expeditions', () => {
  it('is locked before stage 25', () => {
    const s = withBench();
    s.lifetime.highestStage = 10;
    expect(canStartExpedition(s, 'hexcat')).toBe(false);
  });

  it('only sends creatures that are not in the team', () => {
    const s = withBench();
    expect(startExpedition(s, 'mossling', 'short', 0)).toBe(false);
    expect(startExpedition(s, 'hexcat', 'short', 0)).toBe(true);
    expect(startExpedition(s, 'hexcat', 'short', 0)).toBe(false); // already away
    expect(toggleTeamMember(s, 'hexcat')).toBe(false); // cannot join while away
  });

  it('cannot be claimed early and pays out when finished', () => {
    const s = withBench();
    startExpedition(s, 'hexcat', 'medium', 0);
    expect(claimExpedition(s, 0, 1000)).toBeNull();
    expect(expeditionRemaining(s.expeditions[0]!, 0)).toBe(3600);
    const essence = s.currencies.essence;
    const r = claimExpedition(s, 0, 3600 * 1000)!;
    expect(r.essence).toBeGreaterThan(0);
    expect(s.currencies.essence).toBe(essence + r.essence);
    expect(s.expeditions).toHaveLength(0);
  });

  it('can be recalled without reward', () => {
    const s = withBench();
    startExpedition(s, 'hexcat', 'long', 0);
    const gold = s.currencies.gold;
    expect(recallExpedition(s, 0)).toBe(true);
    expect(s.currencies.gold).toBe(gold);
  });
});

describe('charms', () => {
  it('raise global modifiers', () => {
    const s = createInitialState(0, 3);
    const before = globalModifiers(s);
    s.charms.wolfFang = 4;
    s.charms.hourglass = 5;
    const after = globalModifiers(s);
    expect(after.atk).toBeCloseTo(before.atk * 1.2);
    expect(after.bossTime).toBe(before.bossTime + 5);
  });

  it('never exceed max level', () => {
    const s = createInitialState(0, 3);
    for (let i = 0; i < 5000; i++) grantRandomCharm(s);
    expect(s.charms.hourglass).toBe(30);
    expect(grantRandomCharm(s)).toBeNull();
  });
});

describe('save migration v1 -> current', () => {
  it('upgrades an old save through every step', () => {
    const current = toSaveData(createInitialState(0, 3)) as Record<string, unknown>;
    const { charms: _c, expeditions: _e, avatar: _a, ...rest } = current;
    const v1 = { ...rest, version: 1 };
    const migrated = migrate(v1) as Record<string, unknown>;
    expect(migrated.version).toBe(3);
    expect(migrated.charms).toEqual({});
    const s = fromUnknown(v1);
    expect(s.avatar).toEqual(current.avatar);
    expect(s.charms).toEqual({});
    expect(s.expeditions).toEqual([]);
  });
});
