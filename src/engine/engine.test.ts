import { describe, expect, it } from 'vitest';
import { CREATURES } from '../data/creatures';
import { ZONES, ENEMY_BY_ID } from '../data/world';
import {
  applyOfflineProgress,
  buyUpgrade,
  canRebloom,
  createInitialState,
  enemyHp,
  grantXp,
  levelCap,
  nextRandom,
  rebloom,
  setTeam,
  simulate,
  summon,
  synergyOf,
  toggleTeamMember,
  typeEffect,
  typeMultiplier,
  CREATURE_TYPES,
  TYPE_STRONG,
  upgradeLevelCost,
  type GameState,
} from '.';

function fresh(): GameState {
  return createInitialState(1_000_000, 42);
}

describe('data integrity', () => {
  it('has unique creature ids', () => {
    const ids = CREATURES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('references only existing enemies in zones', () => {
    for (const z of ZONES) {
      for (const e of [...z.enemies, z.boss]) expect(ENEMY_BY_ID[e], `${z.id}:${e}`).toBeDefined();
    }
  });
  it('has both realms in every rarity tier that is used', () => {
    for (const r of ['common', 'rare', 'epic', 'legendary']) {
      const realms = new Set(CREATURES.filter((c) => c.rarity === r).map((c) => c.realm));
      expect(realms.size).toBe(2);
    }
  });
});

describe('rng', () => {
  it('is deterministic', () => {
    const [a] = nextRandom(7);
    const [b] = nextRandom(7);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(1);
  });
});

describe('formulas', () => {
  it('scales enemies up with stage', () => {
    expect(enemyHp(100)).toBeGreaterThan(enemyHp(10));
    expect(enemyHp(10, 1, true)).toBeGreaterThan(enemyHp(10));
  });
});

describe('type chart', () => {
  it('matches the creature bible', () => {
    expect(typeEffect('ember', 'grove')).toBe(1.5);
    expect(typeEffect('ember', 'gale')).toBe(1.5);
    expect(typeEffect('ember', 'tide')).toBe(0.75);
    expect(typeEffect('ember', 'stone')).toBe(0.75);
    expect(typeEffect('tide', 'stone')).toBe(1.5);
    expect(typeEffect('grove', 'shade')).toBe(0.75);
    expect(typeEffect('gale', 'shade')).toBe(1.5);
    expect(typeEffect('shade', 'gale')).toBe(0.75);
    expect(typeEffect('tide', 'tide')).toBe(1);
    expect(typeEffect('stone', 'shade')).toBe(1);
  });
  it('gives every type two strengths and makes Shade strong against itself', () => {
    for (const t of CREATURE_TYPES) expect(TYPE_STRONG[t]).toHaveLength(2);
    expect(typeEffect('shade', 'shade')).toBe(1.5);
  });
  it('is antisymmetric except for the Shade mirror', () => {
    for (const a of CREATURE_TYPES) {
      for (const d of CREATURE_TYPES) {
        if (a === d) continue;
        const ad = typeEffect(a, d);
        const da = typeEffect(d, a);
        if (ad === 1.5) expect(da, `${d}->${a}`).toBe(0.75);
        if (ad === 1) expect(da, `${d}->${a}`).toBe(1);
      }
    }
  });
  it('multiplies dual defender types and uses the best attacking type', () => {
    expect(typeMultiplier(['ember'], ['grove', 'gale'])).toBeCloseTo(2.25);
    expect(typeMultiplier(['ember'], ['tide', 'stone'])).toBeCloseTo(0.5625);
    expect(typeMultiplier(['ember'], ['grove', 'stone'])).toBe(1.125);
    expect(typeMultiplier(['tide', 'gale'], ['shade'])).toBe(1.5);
    expect(typeMultiplier([], ['shade'])).toBe(1);
  });
  it('gives every species one or two distinct types and lets enemies inherit them', () => {
    for (const c of CREATURES) {
      expect(c.types.length, c.id).toBeGreaterThanOrEqual(1);
      expect(c.types.length, c.id).toBeLessThanOrEqual(2);
      expect(new Set(c.types).size, c.id).toBe(c.types.length);
      expect(ENEMY_BY_ID[`wild_${c.id}`]!.types).toEqual(c.types);
      expect(ENEMY_BY_ID[`alpha_${c.id}`]!.types).toEqual(c.types);
    }
    const used = new Set(CREATURES.flatMap((c) => c.types));
    expect(used.size).toBe(CREATURE_TYPES.length);
  });
  it('records the effectiveness on every hit', () => {
    const s = fresh();
    simulate(s, 20);
    const hits = s.battle.log.filter((e) => e.t === 'hit');
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) if (h.t === 'hit') expect(h.eff).toBeGreaterThan(0);
  });
});

describe('combat', () => {
  it('kills enemies and earns gold over time', () => {
    const s = fresh();
    const r = simulate(s, 60);
    expect(r.kills).toBeGreaterThan(0);
    expect(s.currencies.gold).toBeGreaterThan(0);
    expect(s.battle.stage).toBeGreaterThan(1);
  });
  it('is deterministic for the same seed', () => {
    const a = fresh();
    const b = fresh();
    simulate(a, 120);
    simulate(b, 120);
    expect(a.battle.stage).toBe(b.battle.stage);
    expect(a.currencies.gold).toBeCloseTo(b.currencies.gold);
  });
  it('retreats and stops auto-advance when the team is wiped', () => {
    const s = fresh();
    s.battle.stage = 200;
    s.runHighestStage = 200;
    simulate(s, 30);
    expect(s.battle.stage).toBeLessThan(200);
    expect(s.battle.autoAdvance).toBe(false);
  });
});

describe('progression', () => {
  it('levels creatures up to the cap', () => {
    const s = fresh();
    grantXp(s, 'mossling', 1e12);
    expect(s.creatures.mossling!.level).toBe(levelCap(0));
  });
  it('buys upgrades and raises the cost', () => {
    const s = fresh();
    s.currencies.gold = 1000;
    const before = upgradeLevelCost(s, 'sharpen');
    expect(buyUpgrade(s, 'sharpen')).toBe(true);
    expect(upgradeLevelCost(s, 'sharpen')).toBeGreaterThan(before);
    expect(s.currencies.gold).toBeCloseTo(1000 - before);
  });
  it('refuses upgrades without gold', () => {
    const s = fresh();
    expect(buyUpgrade(s, 'sharpen')).toBe(false);
  });
  it('summons creatures and spends essence', () => {
    const s = fresh();
    s.currencies.essence = 1000;
    for (let i = 0; i < 50; i++) expect(summon(s)).not.toBeNull();
    expect(s.currencies.essence).toBe(500);
    expect(Object.keys(s.creatures).length).toBeGreaterThan(2);
    expect(s.lifetime.summons).toBe(50);
  });
  it('only summons creatures from unlocked zones', () => {
    const s = fresh();
    s.currencies.essence = 10_000;
    for (let i = 0; i < 500; i++) summon(s);
    for (const id of Object.keys(s.creatures)) {
      expect(CREATURES.find((c) => c.id === id)!.unlockZone).toBe(0);
    }
  });
  it('validates team changes', () => {
    const s = fresh();
    expect(setTeam(s, ['notOwned'])).toBe(false);
    expect(toggleTeamMember(s, 'mossling')).toBe(true);
    expect(s.team).toEqual(['gloomwisp']);
    expect(toggleTeamMember(s, 'gloomwisp')).toBe(false); // never empty
  });
  it('detects synergies', () => {
    expect(synergyOf(['mossling', 'gloomwisp']).kind).toBe('twilight');
    expect(synergyOf(['mossling', 'emberpup', 'puddlefin'])).toEqual({ kind: 'pure', realm: 'hearth' });
  });
  it('rebloom resets the run but keeps creatures and grants seeds', () => {
    const s = fresh();
    expect(canRebloom(s)).toBe(false);
    s.runHighestStage = 150;
    s.currencies.gold = 1e9;
    s.upgrades.sharpen = 50;
    s.creatures.mossling!.stars = 2;
    const seeds = rebloom(s);
    expect(seeds).toBeGreaterThan(0);
    expect(s.currencies.seeds).toBe(seeds);
    expect(s.currencies.gold).toBe(0);
    expect(s.upgrades.sharpen).toBe(0);
    expect(s.creatures.mossling!.stars).toBe(2);
    expect(s.creatures.mossling!.level).toBe(1);
    expect(s.battle.stage).toBe(1);
  });
});

describe('offline progress', () => {
  it('ignores short gaps', () => {
    const s = fresh();
    expect(applyOfflineProgress(s, s.lastSeen + 5_000)).toBeNull();
  });
  it('grants rewards, respects the cap and keeps the stage', () => {
    const s = fresh();
    s.battle.stage = 5;
    const report = applyOfflineProgress(s, s.lastSeen + 100 * 3600 * 1000)!;
    expect(report.cappedSeconds).toBe(4 * 3600);
    expect(report.gold).toBeGreaterThan(0);
    expect(s.currencies.gold).toBeGreaterThan(0);
    expect(s.battle.stage).toBe(5);
  });
});
