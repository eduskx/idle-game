import { CREATURE_BY_ID } from '../data/creatures';
import { EXPEDITION_DURATIONS, EXPEDITION_SLOTS, EXPEDITION_UNLOCK_STAGE } from '../data/expeditions';
import { charmDropChance, grantRandomCharm } from './charms';
import { killGold, zoneOf } from './formulas';
import { roll } from './rng';
import type { CharmId } from '../data/charms';
import type { Expedition, GameState, Rarity } from './types';

const RARITY_FACTOR: Record<Rarity, number> = {
  common: 1,
  rare: 1.4,
  epic: 1.9,
  legendary: 2.6,
  mythic: 3.5,
};

export function expeditionsUnlocked(s: GameState): boolean {
  return s.lifetime.highestStage >= EXPEDITION_UNLOCK_STAGE;
}

export function isOnExpedition(s: GameState, defId: string): boolean {
  return s.expeditions.some((e) => e.defId === defId);
}

export function expeditionDuration(e: Pick<Expedition, 'durationId'>) {
  return EXPEDITION_DURATIONS.find((d) => d.id === e.durationId)!;
}

export function expeditionRemaining(e: Expedition, now = Date.now()): number {
  return Math.max(0, e.startedAt + expeditionDuration(e).seconds * 1000 - now) / 1000;
}

export interface ExpeditionReward {
  gold: number;
  essence: number;
  charmChance: number;
}

/** Expected rewards. Gold follows the current run, essence the deepest zone ever reached. */
export function expeditionReward(
  s: GameState,
  defId: string,
  durationId: Expedition['durationId'],
): ExpeditionReward {
  const def = CREATURE_BY_ID[defId]!;
  const owned = s.creatures[defId]!;
  const d = EXPEDITION_DURATIONS.find((x) => x.id === durationId)!;
  const hours = d.seconds / 3600;
  const power = RARITY_FACTOR[def.rarity] * (1 + 0.15 * owned.stars);
  const zone = zoneOf(s.lifetime.highestStage);
  return {
    gold: killGold(Math.max(1, Math.floor(s.runHighestStage * 0.9)), false) * 90 * hours * power,
    essence: Math.floor(hours * (2 + zone) * power),
    charmChance: Math.min(0.95, charmDropChance(s, d.charmChance * (1 + 0.05 * owned.stars))),
  };
}

export function canStartExpedition(s: GameState, defId: string): boolean {
  return (
    expeditionsUnlocked(s) &&
    Boolean(s.creatures[defId]) &&
    !s.team.includes(defId) &&
    !isOnExpedition(s, defId) &&
    s.expeditions.length < EXPEDITION_SLOTS
  );
}

export function startExpedition(
  s: GameState,
  defId: string,
  durationId: Expedition['durationId'],
  now = Date.now(),
): boolean {
  if (!canStartExpedition(s, defId)) return false;
  s.expeditions.push({ defId, durationId, startedAt: now });
  return true;
}

export interface ClaimResult {
  gold: number;
  essence: number;
  charm: CharmId | null;
}

export function claimExpedition(s: GameState, index: number, now = Date.now()): ClaimResult | null {
  const e = s.expeditions[index];
  if (!e || expeditionRemaining(e, now) > 0) return null;
  const r = expeditionReward(s, e.defId, e.durationId);
  s.expeditions.splice(index, 1);
  s.currencies.gold += r.gold;
  s.lifetime.goldEarned += r.gold;
  s.currencies.essence += r.essence;
  const charm = roll(s) < r.charmChance ? grantRandomCharm(s) : null;
  return { gold: r.gold, essence: r.essence, charm };
}

/** Cancels an expedition early without rewards. */
export function recallExpedition(s: GameState, index: number): boolean {
  if (!s.expeditions[index]) return false;
  s.expeditions.splice(index, 1);
  return true;
}
