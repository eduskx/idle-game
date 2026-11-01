/**
 * All balancing numbers in one place. Change values here, then run
 * `npm run simulate` to see how the pacing shifts.
 */
import type { Element, OwnedCreature } from './types';
import { BOSS_EVERY, STAGES_PER_ZONE } from './types';

export const BALANCE = {
  enemyHpBase: 25,
  enemyHpGrowth: 1.1,
  enemyAtkBase: 2.2,
  enemyAtkGrowth: 1.09,
  enemySpeed: 0.8,
  bossHpMult: 7,
  bossAtkMult: 1.6,
  /** Extra multiplier every time the zone list loops (endless mode). */
  cycleMult: 4,

  goldBase: 2,
  goldGrowth: 1.09,
  bossGoldMult: 10,
  xpBase: 1.5,
  xpGrowth: 1.07,
  bossXpMult: 8,

  essenceChance: 0.025,
  bossEssence: 3,
  summonCost: 10,

  baseCritChance: 0.05,
  critMult: 2,
  elementAdvantage: 1.5,
  elementDisadvantage: 0.75,
  regenPerSecond: 0.02,

  levelAtkGrowth: 1.07,
  levelHpGrowth: 1.07,
  starMult: 1.4,
  baseLevelCap: 25,
  levelCapPerStar: 15,
  xpToLevelBase: 8,
  xpToLevelGrowth: 1.16,

  rebloomMinStage: 60,
  seedDivisor: 30,
  seedExponent: 1.7,

  baseOfflineHours: 4,
  offlineEfficiency: 0.6,
  baseTeamSlots: 3,

  pureRealmBonus: 0.25,
  twilightBonus: 0.2,
} as const;

/** Duplicate shards required to go from `stars` to `stars + 1`. */
export const STAR_SHARDS = [2, 4, 6, 10, 15, 22, 30, 40, 55, 75] as const;
export const MAX_STARS = STAR_SHARDS.length;

export function zoneOf(stage: number): number {
  return Math.floor((stage - 1) / STAGES_PER_ZONE);
}

export function stageInZone(stage: number): number {
  return ((stage - 1) % STAGES_PER_ZONE) + 1;
}

export function isBossStage(stage: number): boolean {
  return stage % BOSS_EVERY === 0;
}

function cycleFactor(stage: number): number {
  const cycles = Math.floor(zoneOf(stage) / 12);
  return BALANCE.cycleMult ** cycles;
}

export function enemyHp(stage: number, hpMult = 1, boss = false): number {
  const base = BALANCE.enemyHpBase * BALANCE.enemyHpGrowth ** (stage - 1) * hpMult * cycleFactor(stage);
  return boss ? base * BALANCE.bossHpMult : base;
}

export function enemyAtk(stage: number, atkMult = 1, boss = false): number {
  const base = BALANCE.enemyAtkBase * BALANCE.enemyAtkGrowth ** (stage - 1) * atkMult * cycleFactor(stage);
  return boss ? base * BALANCE.bossAtkMult : base;
}

export function killGold(stage: number, boss: boolean): number {
  const g = BALANCE.goldBase * BALANCE.goldGrowth ** (stage - 1);
  return boss ? g * BALANCE.bossGoldMult : g;
}

export function killXp(stage: number, boss: boolean): number {
  const x = BALANCE.xpBase * BALANCE.xpGrowth ** (stage - 1);
  return boss ? x * BALANCE.bossXpMult : x;
}

export function essencePerDrop(stage: number): number {
  return 1 + Math.floor(zoneOf(stage) / 2);
}

export function bossEssence(stage: number): number {
  return BALANCE.bossEssence + zoneOf(stage);
}

export function elementMultiplier(attacker: Element, defender: Element): number {
  if (attacker === defender) return 1;
  const beats: Record<Element, Element> = { ember: 'grove', grove: 'tide', tide: 'ember' };
  if (beats[attacker] === defender) return BALANCE.elementAdvantage;
  return BALANCE.elementDisadvantage;
}

export function levelCap(stars: number): number {
  return BALANCE.baseLevelCap + BALANCE.levelCapPerStar * stars;
}

export function xpToNextLevel(level: number): number {
  return BALANCE.xpToLevelBase * BALANCE.xpToLevelGrowth ** (level - 1);
}

export function creatureLevelMult(c: Pick<OwnedCreature, 'level' | 'stars'>): { atk: number; hp: number } {
  const star = BALANCE.starMult ** c.stars;
  return {
    atk: BALANCE.levelAtkGrowth ** (c.level - 1) * (1 + 0.1 * (c.level - 1)) * star,
    hp: BALANCE.levelHpGrowth ** (c.level - 1) * (1 + 0.1 * (c.level - 1)) * star,
  };
}

export function upgradeCost(baseCost: number, growth: number, level: number): number {
  return baseCost * growth ** level;
}

/** Multiplier from a gold upgrade: linear growth plus a doubling every 25 levels. */
export function milestoneMult(level: number, perLevel: number): number {
  return (1 + perLevel * level) * 2 ** Math.floor(level / 25);
}

export function seedsForRebloom(runHighestStage: number): number {
  if (runHighestStage < BALANCE.rebloomMinStage) return 0;
  return Math.floor((runHighestStage / BALANCE.seedDivisor) ** BALANCE.seedExponent);
}
