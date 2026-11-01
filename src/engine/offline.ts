import { BALANCE, isBossStage } from './formulas';
import { simulate } from './combat';
import { grantXp } from './progression';
import { globalModifiers } from './stats';
import type { GameState } from './types';

export interface OfflineReport {
  seconds: number;
  cappedSeconds: number;
  gold: number;
  xp: number;
  essence: number;
  kills: number;
}

/** Max real seconds we actually simulate; the rest is extrapolated. Keeps load time low. */
const MAX_SIMULATED_SECONDS = 300;
/** Ignore tiny gaps (tab switches); the live loop covers those. */
const MIN_OFFLINE_SECONDS = 30;

/**
 * Applies progress for the time the game was closed. The team farms the stage it
 * was on (no advancing while offline), with reduced efficiency. Mutates `s`.
 */
export function applyOfflineProgress(s: GameState, now = Date.now()): OfflineReport | null {
  const elapsed = Math.max(0, (now - s.lastSeen) / 1000);
  s.lastSeen = now;
  if (elapsed < MIN_OFFLINE_SECONDS) return null;

  const mods = globalModifiers(s);
  const capped = Math.min(elapsed, mods.offlineHours * 3600);
  const simSeconds = Math.min(capped, MAX_SIMULATED_SECONDS);

  const autoAdvance = s.battle.autoAdvance;
  const stage = s.battle.stage;
  s.battle.autoAdvance = false;
  // Never fight a boss offline (it could fail and push the team back).
  if (isBossStage(s.battle.stage) && s.battle.stage > 1) {
    s.battle.stage -= 1;
    s.battle.enemy = null;
  }
  const r = simulate(s, simSeconds);
  s.battle.autoAdvance = autoAdvance;
  // Return to where the player left off; a defeat while offline should not push them back.
  s.battle.stage = stage;
  s.battle.enemy = null;
  s.battle.log = [];

  // Extrapolate the remaining time from the simulated rate.
  const factor = (capped / simSeconds) * BALANCE.offlineEfficiency;
  const extra = factor - 1;
  const report: OfflineReport = {
    seconds: elapsed,
    cappedSeconds: capped,
    gold: r.gold * factor,
    xp: r.xp * factor,
    essence: Math.floor(r.essence * factor),
    kills: Math.floor(r.kills * factor),
  };
  if (extra > 0) {
    s.currencies.gold += r.gold * extra;
    s.lifetime.goldEarned += r.gold * extra;
    s.currencies.essence += Math.floor(r.essence * extra);
    s.lifetime.kills += Math.floor(r.kills * extra);
    for (const id of s.team) grantXp(s, id, r.xp * extra);
  } else {
    // Efficiency below 1 for short gaps: claw back the surplus (XP is left as a small bonus).
    s.currencies.gold = Math.max(0, s.currencies.gold + r.gold * extra);
    s.currencies.essence = Math.max(0, s.currencies.essence + Math.floor(r.essence * extra));
  }
  return report;
}
