import { CREATURES, RARITY_ORDER } from '../data/creatures';
import { ACHIEVEMENTS, TALENTS, UPGRADES } from '../data/progression';
import {
  BALANCE,
  levelCap,
  MAX_STARS,
  seedsForRebloom,
  STAR_SHARDS,
  upgradeCost,
  xpToNextLevel,
  zoneOf,
} from './formulas';
import { roll } from './rng';
import { newBattle, newOwnedCreature, emptyUpgrades } from './state';
import { globalModifiers, teamSlots } from './stats';
import type { CreatureDef, GameState, Rarity, TalentId, UpgradeId } from './types';

// ---------------------------------------------------------------- XP / levels

export function grantXp(s: GameState, defId: string, amount: number): void {
  const c = s.creatures[defId];
  if (!c) return;
  const cap = levelCap(c.stars);
  if (c.level >= cap) return;
  c.xp += amount;
  while (c.level < cap) {
    const need = xpToNextLevel(c.level);
    if (c.xp < need) break;
    c.xp -= need;
    c.level += 1;
  }
  if (c.level >= cap) c.xp = 0;
}

// ---------------------------------------------------------------- Gold upgrades

export function upgradeLevelCost(s: GameState, id: UpgradeId): number {
  const def = UPGRADES.find((u) => u.id === id)!;
  return upgradeCost(def.baseCost, def.costGrowth, s.upgrades[id]);
}

export function canBuyUpgrade(s: GameState, id: UpgradeId): boolean {
  const def = UPGRADES.find((u) => u.id === id)!;
  return s.upgrades[id] < def.maxLevel && s.currencies.gold >= upgradeLevelCost(s, id);
}

export function buyUpgrade(s: GameState, id: UpgradeId): boolean {
  if (!canBuyUpgrade(s, id)) return false;
  s.currencies.gold -= upgradeLevelCost(s, id);
  s.upgrades[id] += 1;
  return true;
}

/** Buys as many levels as affordable (max `limit`). Returns levels bought. */
export function buyUpgradeMax(s: GameState, id: UpgradeId, limit = 1000): number {
  let n = 0;
  while (n < limit && buyUpgrade(s, id)) n++;
  return n;
}

// ---------------------------------------------------------------- Talents

export function talentCost(s: GameState, id: TalentId): number {
  const def = TALENTS.find((t) => t.id === id)!;
  return Math.ceil(upgradeCost(def.baseCost, def.costGrowth, s.talents[id]));
}

export function isTalentUnlocked(s: GameState, id: TalentId): boolean {
  const def = TALENTS.find((t) => t.id === id)!;
  return !def.requires || s.talents[def.requires] > 0;
}

export function canBuyTalent(s: GameState, id: TalentId): boolean {
  const def = TALENTS.find((t) => t.id === id)!;
  return (
    isTalentUnlocked(s, id) &&
    s.talents[id] < def.maxLevel &&
    s.currencies.seeds >= talentCost(s, id)
  );
}

export function buyTalent(s: GameState, id: TalentId): boolean {
  if (!canBuyTalent(s, id)) return false;
  s.currencies.seeds -= talentCost(s, id);
  s.talents[id] += 1;
  return true;
}

// ---------------------------------------------------------------- Summoning

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 58,
  rare: 28,
  epic: 10,
  legendary: 3.3,
  mythic: 0.7,
};

export function summonCost(): number {
  return BALANCE.summonCost;
}

/** Creatures available in the summon pool, based on the deepest zone ever reached. */
export function summonPool(s: GameState): CreatureDef[] {
  const zone = zoneOf(s.lifetime.highestStage);
  return CREATURES.filter((c) => c.unlockZone <= zone);
}

export interface SummonResult {
  defId: string;
  isNew: boolean;
  starUp: boolean;
}

export function canSummon(s: GameState, count = 1): boolean {
  return s.currencies.essence >= summonCost() * count;
}

export function summon(s: GameState): SummonResult | null {
  if (!canSummon(s)) return null;
  const pool = summonPool(s);
  const available = RARITY_ORDER.filter((r) => pool.some((c) => c.rarity === r));
  const totalWeight = available.reduce((sum, r) => sum + RARITY_WEIGHTS[r], 0);
  let pick = roll(s) * totalWeight;
  let rarity: Rarity = available[0]!;
  for (const r of available) {
    pick -= RARITY_WEIGHTS[r];
    if (pick <= 0) {
      rarity = r;
      break;
    }
  }
  const candidates = pool.filter((c) => c.rarity === rarity);
  const def = candidates[Math.floor(roll(s) * candidates.length)] ?? candidates[0]!;

  s.currencies.essence -= summonCost();
  s.lifetime.summons += 1;

  const owned = s.creatures[def.id];
  if (!owned) {
    s.creatures[def.id] = newOwnedCreature(def.id);
    if (s.team.length < teamSlots(s)) s.team.push(def.id);
    return { defId: def.id, isNew: true, starUp: false };
  }
  let starUp = false;
  if (owned.stars < MAX_STARS) {
    owned.shards += 1;
    const need = STAR_SHARDS[owned.stars]!;
    if (owned.shards >= need) {
      owned.shards -= need;
      owned.stars += 1;
      starUp = true;
    }
  }
  return { defId: def.id, isNew: false, starUp };
}

// ---------------------------------------------------------------- Team

export function setTeam(s: GameState, team: string[]): boolean {
  const slots = teamSlots(s);
  const unique = [...new Set(team)].filter((id) => s.creatures[id]);
  if (unique.length === 0 || unique.length > slots) return false;
  s.team = unique;
  // Reset HP bookkeeping for removed members.
  for (const id of Object.keys(s.battle.teamHp)) {
    if (!unique.includes(id)) {
      delete s.battle.teamHp[id];
      delete s.battle.attackTimers[id];
    }
  }
  return true;
}

export function toggleTeamMember(s: GameState, defId: string): boolean {
  if (s.team.includes(defId)) {
    if (s.team.length <= 1) return false;
    return setTeam(s, s.team.filter((id) => id !== defId));
  }
  if (s.team.length >= teamSlots(s)) return false;
  return setTeam(s, [...s.team, defId]);
}

export function moveTeamMember(s: GameState, defId: string, dir: -1 | 1): boolean {
  const i = s.team.indexOf(defId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= s.team.length) return false;
  const team = [...s.team];
  [team[i], team[j]] = [team[j]!, team[i]!];
  s.team = team;
  return true;
}

// ---------------------------------------------------------------- Rebloom (prestige)

export function rebloomReward(s: GameState): number {
  return Math.floor(seedsForRebloom(s.runHighestStage) * globalModifiers(s).seeds);
}

export function canRebloom(s: GameState): boolean {
  return rebloomReward(s) > 0;
}

/**
 * Prestige: trade the current run for seeds. Gold, gold upgrades, stage and
 * creature levels reset. Creatures, stars, talents, essence and achievements stay.
 */
export function rebloom(s: GameState): number {
  const reward = rebloomReward(s);
  if (reward <= 0) return 0;
  s.currencies.seeds += reward;
  s.currencies.gold = 0;
  s.upgrades = emptyUpgrades();
  for (const c of Object.values(s.creatures)) {
    c.level = 1;
    c.xp = 0;
  }
  const startStage = Math.max(1, Math.min(1 + 20 * s.talents.headStart, s.runHighestStage - 1));
  s.battle = newBattle(startStage);
  s.runHighestStage = startStage;
  s.lifetime.reblooms += 1;
  // Pack upgrades are gone, so trim the team if needed.
  const slots = teamSlots(s);
  if (s.team.length > slots) s.team = s.team.slice(0, slots);
  return reward;
}

// ---------------------------------------------------------------- Achievements

/** Unlocks any newly earned achievements. Returns their ids. */
export function checkAchievements(s: GameState): string[] {
  const unlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements.includes(a.id) && a.check(s)) {
      s.achievements.push(a.id);
      unlocked.push(a.id);
    }
  }
  return unlocked;
}

