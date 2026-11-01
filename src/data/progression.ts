import type { GameState, Realm, TalentId, UpgradeId } from '../engine/types';
import { CREATURE_BY_ID } from './creatures';

export interface UpgradeDef {
  id: UpgradeId;
  baseCost: number;
  costGrowth: number;
  /** Max level, Infinity for unlimited. */
  maxLevel: number;
}

/** Gold upgrades: reset on every rebloom. */
export const UPGRADES: UpgradeDef[] = [
  { id: 'sharpen', baseCost: 10, costGrowth: 1.15, maxLevel: Infinity },
  { id: 'vitality', baseCost: 10, costGrowth: 1.15, maxLevel: Infinity },
  { id: 'greed', baseCost: 25, costGrowth: 1.17, maxLevel: Infinity },
  { id: 'wisdom', baseCost: 25, costGrowth: 1.17, maxLevel: Infinity },
  { id: 'focus', baseCost: 100, costGrowth: 1.35, maxLevel: 40 },
  { id: 'swiftness', baseCost: 150, costGrowth: 1.4, maxLevel: 50 },
  { id: 'pack', baseCost: 5000, costGrowth: 60, maxLevel: 2 },
];

export interface TalentDef {
  id: TalentId;
  baseCost: number;
  costGrowth: number;
  maxLevel: number;
  /** Talent that needs at least one level before this one can be bought. */
  requires?: TalentId;
}

/** Rebloom talents: bought with seeds, permanent. */
export const TALENTS: TalentDef[] = [
  { id: 'rootStrength', baseCost: 1, costGrowth: 1.25, maxLevel: 200 },
  { id: 'barkSkin', baseCost: 1, costGrowth: 1.25, maxLevel: 200 },
  { id: 'goldenSap', baseCost: 2, costGrowth: 1.3, maxLevel: 100, requires: 'rootStrength' },
  { id: 'deepRoots', baseCost: 3, costGrowth: 1.3, maxLevel: 100, requires: 'barkSkin' },
  { id: 'seedRain', baseCost: 5, costGrowth: 1.45, maxLevel: 50, requires: 'goldenSap' },
  { id: 'nightBloom', baseCost: 5, costGrowth: 1.4, maxLevel: 50, requires: 'deepRoots' },
  { id: 'longDream', baseCost: 8, costGrowth: 2, maxLevel: 16, requires: 'goldenSap' },
  { id: 'swiftWind', baseCost: 10, costGrowth: 1.6, maxLevel: 25, requires: 'nightBloom' },
  { id: 'kinship', baseCost: 15, costGrowth: 1.5, maxLevel: 40, requires: 'seedRain' },
  { id: 'twilight', baseCost: 15, costGrowth: 1.5, maxLevel: 40, requires: 'seedRain' },
  { id: 'headStart', baseCost: 25, costGrowth: 2.2, maxLevel: 10, requires: 'swiftWind' },
  { id: 'bigPack', baseCost: 500, costGrowth: 1, maxLevel: 1, requires: 'headStart' },
];

export interface AchievementDef {
  id: string;
  check: (s: GameState) => boolean;
}

function stageAch(stage: number): AchievementDef {
  return { id: `stage${stage}`, check: (s) => s.lifetime.highestStage >= stage };
}

/** Each achievement grants a small permanent damage bonus (see ACHIEVEMENT_BONUS). */
export const ACHIEVEMENTS: AchievementDef[] = [
  stageAch(10),
  stageAch(50),
  stageAch(100),
  stageAch(250),
  stageAch(500),
  stageAch(1000),
  stageAch(2000),
  { id: 'kills100', check: (s) => s.lifetime.kills >= 100 },
  { id: 'kills10k', check: (s) => s.lifetime.kills >= 10_000 },
  { id: 'kills1m', check: (s) => s.lifetime.kills >= 1_000_000 },
  { id: 'boss1', check: (s) => s.lifetime.bossKills >= 1 },
  { id: 'boss100', check: (s) => s.lifetime.bossKills >= 100 },
  { id: 'summon10', check: (s) => s.lifetime.summons >= 10 },
  { id: 'summon100', check: (s) => s.lifetime.summons >= 100 },
  { id: 'rebloom1', check: (s) => s.lifetime.reblooms >= 1 },
  { id: 'rebloom10', check: (s) => s.lifetime.reblooms >= 10 },
  { id: 'collect10', check: (s) => Object.keys(s.creatures).length >= 10 },
  { id: 'collectAll', check: (s) => Object.keys(s.creatures).length >= 30 },
  { id: 'star5', check: (s) => Object.values(s.creatures).some((c) => c.stars >= 5) },
  { id: 'pureHearth', check: (s) => isPureTeam(s, 'hearth') },
  { id: 'pureUmbra', check: (s) => isPureTeam(s, 'umbra') },
];

function isPureTeam(s: GameState, realm: Realm): boolean {
  return s.team.length >= 3 && s.team.every((id) => CREATURE_BY_ID[id]?.realm === realm);
}

/** Permanent damage multiplier gained per unlocked achievement. */
export const ACHIEVEMENT_BONUS = 0.03;
