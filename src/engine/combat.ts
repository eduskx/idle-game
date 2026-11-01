import { getEnemy, getZone } from '../data/world';
import {
  BALANCE,
  bossEssence,
  elementMultiplier,
  enemyAtk,
  enemyHp,
  essencePerDrop,
  isBossStage,
  killGold,
  killXp,
  zoneOf,
} from './formulas';
import { grantXp } from './progression';
import { roll } from './rng';
import { globalModifiers, teamStats, type GlobalModifiers, type TeamMemberStats } from './stats';
import type { CombatEvent, Fighter, GameState } from './types';
import { BOSS_TIME, KILLS_PER_STAGE } from './types';

const MAX_LOG = 24;
let eventId = 0;

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

function pushEvent(s: GameState, e: DistributiveOmit<CombatEvent, 'id'>): void {
  if (s.battle.log.length >= MAX_LOG) s.battle.log.shift();
  s.battle.log.push({ ...e, id: ++eventId } as CombatEvent);
}

export interface TickResult {
  gold: number;
  xp: number;
  essence: number;
  kills: number;
}

export function spawnEnemy(s: GameState): Fighter {
  const stage = s.battle.stage;
  const zone = getZone(zoneOf(stage));
  const boss = isBossStage(stage);
  const defId = boss
    ? zone.boss
    : (zone.enemies[Math.floor(roll(s) * zone.enemies.length)] ?? zone.enemies[0]!);
  const def = getEnemy(defId);
  const maxHp = enemyHp(stage, def.hpMult, boss);
  return {
    defId,
    maxHp,
    hp: maxHp,
    atk: enemyAtk(stage, def.atkMult, boss),
    speed: BALANCE.enemySpeed,
    element: def.element,
    attackTimer: 0,
    isBoss: boss,
  };
}

function healTeam(s: GameState, team: TeamMemberStats[]): void {
  s.battle.teamHp = Object.fromEntries(team.map((m) => [m.defId, m.maxHp]));
}

function startStage(s: GameState, team: TeamMemberStats[]): void {
  s.battle.kills = 0;
  s.battle.enemy = spawnEnemy(s);
  s.battle.enemyAge = 0;
  s.battle.bossTimer = isBossStage(s.battle.stage) ? BOSS_TIME : null;
  healTeam(s, team);
}

/** Moves the team one stage back after a defeat and stops auto-advance. */
function retreat(s: GameState, team: TeamMemberStats[], bossFail: boolean): void {
  pushEvent(s, bossFail ? { t: 'bossFail' } : { t: 'defeat' });
  s.battle.stage = Math.max(1, s.battle.stage - 1);
  s.battle.autoAdvance = false;
  startStage(s, team);
}

function pickTarget(team: TeamMemberStats[], hp: Record<string, number>): TeamMemberStats | undefined {
  const alive = team.filter((m) => (hp[m.defId] ?? 0) > 0);
  return alive.find((m) => m.ability === 'taunt') ?? alive[0];
}

/**
 * Advances the battle by `dt` seconds. Mutates `s`. Use a fixed small `dt`
 * (e.g. 0.1) for stable results; larger steps are split internally.
 */
export function tick(s: GameState, dt: number, mods: GlobalModifiers = globalModifiers(s)): TickResult {
  const result: TickResult = { gold: 0, xp: 0, essence: 0, kills: 0 };
  const team = teamStats(s, mods);
  if (team.length === 0) return result;

  const b = s.battle;
  // Make sure every member has HP/timer entries (e.g. after a team change).
  for (const m of team) {
    if (b.teamHp[m.defId] === undefined) b.teamHp[m.defId] = m.maxHp;
    b.teamHp[m.defId] = Math.min(b.teamHp[m.defId]!, m.maxHp);
    if (b.attackTimers[m.defId] === undefined) b.attackTimers[m.defId] = 0;
  }
  if (!b.enemy) startStage(s, team);
  const enemy = b.enemy!;

  b.enemyAge += dt;
  s.lifetime.playSeconds += dt;

  // Passive regeneration
  for (const m of team) {
    const cur = b.teamHp[m.defId]!;
    if (cur > 0) b.teamHp[m.defId] = Math.min(m.maxHp, cur + m.maxHp * BALANCE.regenPerSecond * dt);
  }

  // Team attacks
  for (const m of team) {
    if ((b.teamHp[m.defId] ?? 0) <= 0) continue;
    b.attackTimers[m.defId] = (b.attackTimers[m.defId] ?? 0) + dt * m.speed;
    while (b.attackTimers[m.defId]! >= 1 && enemy.hp > 0) {
      b.attackTimers[m.defId]! -= 1;
      const crit = roll(s) < m.critChance;
      let dmg = m.atk * elementMultiplier(m.element, enemy.element) * (crit ? BALANCE.critMult : 1);
      if (m.ability === 'bossSlayer' && enemy.isBoss) dmg *= 1 + m.abilityValue;
      if (m.ability === 'rage') dmg *= 1 + Math.min(3, m.abilityValue * b.enemyAge);
      if (m.ability === 'execute' && enemy.hp < enemy.maxHp * 0.3) dmg *= 1 + m.abilityValue;
      enemy.hp -= dmg;
      pushEvent(s, { t: 'hit', target: 'enemy', amount: dmg, crit });
      if (m.ability === 'lifesteal') {
        b.teamHp[m.defId] = Math.min(m.maxHp, b.teamHp[m.defId]! + dmg * m.abilityValue);
      }
      if (m.ability === 'teamHeal') {
        const injured = team
          .filter((o) => (b.teamHp[o.defId] ?? 0) > 0)
          .sort((x, y) => b.teamHp[x.defId]! / x.maxHp - b.teamHp[y.defId]! / y.maxHp)[0];
        if (injured) {
          b.teamHp[injured.defId] = Math.min(
            injured.maxHp,
            b.teamHp[injured.defId]! + m.atk * m.abilityValue,
          );
        }
      }
    }
  }

  if (enemy.hp <= 0) {
    const boss = Boolean(enemy.isBoss);
    const stage = b.stage;
    const gold = killGold(stage, boss) * mods.gold;
    const xp = killXp(stage, boss) * mods.xp;
    let essence = 0;
    if (boss) essence += bossEssence(stage) * mods.essence;
    if (roll(s) < BALANCE.essenceChance) essence += essencePerDrop(stage) * mods.essence;
    essence = Math.floor(essence);

    s.currencies.gold += gold;
    s.currencies.essence += essence;
    s.lifetime.goldEarned += gold;
    s.lifetime.kills += 1;
    if (boss) s.lifetime.bossKills += 1;
    for (const m of team) grantXp(s, m.defId, xp);
    result.gold += gold;
    result.xp += xp;
    result.essence += essence;
    result.kills += 1;
    pushEvent(s, { t: 'kill', gold, xp, essence });

    b.kills += 1;
    const needed = boss ? 1 : KILLS_PER_STAGE;
    if (b.kills >= needed) {
      pushEvent(s, { t: 'stageClear', stage });
      if (b.autoAdvance || boss) {
        b.stage += 1;
        if (b.stage > s.runHighestStage) s.runHighestStage = b.stage;
        if (b.stage > s.lifetime.highestStage) s.lifetime.highestStage = b.stage;
      }
      // Recompute stats: levels may have changed from the XP above.
      startStage(s, teamStats(s, mods));
    } else {
      b.enemy = spawnEnemy(s);
      b.enemyAge = 0;
    }
    return result;
  }

  // Boss timer
  if (b.bossTimer !== null) {
    b.bossTimer -= dt;
    if (b.bossTimer <= 0) {
      retreat(s, team, true);
      return result;
    }
  }

  // Enemy attacks
  enemy.attackTimer += dt * enemy.speed;
  while (enemy.attackTimer >= 1) {
    enemy.attackTimer -= 1;
    const target = pickTarget(team, b.teamHp);
    if (!target) break;
    const dmg = enemy.atk * elementMultiplier(enemy.element, target.element);
    b.teamHp[target.defId] = b.teamHp[target.defId]! - dmg;
    pushEvent(s, { t: 'hit', target: target.defId, amount: dmg, crit: false });
    if (target.ability === 'thorns') {
      enemy.hp -= dmg * target.abilityValue * 3;
    }
  }

  if (team.every((m) => (b.teamHp[m.defId] ?? 0) <= 0)) {
    retreat(s, team, Boolean(enemy.isBoss));
  }

  return result;
}

/** Runs many fixed-size ticks. Returns accumulated rewards. */
export function simulate(s: GameState, seconds: number, step = 0.1): TickResult {
  const total: TickResult = { gold: 0, xp: 0, essence: 0, kills: 0 };
  let mods = globalModifiers(s);
  let elapsed = 0;
  let sinceRefresh = 0;
  while (elapsed < seconds) {
    const dt = Math.min(step, seconds - elapsed);
    const r = tick(s, dt, mods);
    total.gold += r.gold;
    total.xp += r.xp;
    total.essence += r.essence;
    total.kills += r.kills;
    elapsed += dt;
    sinceRefresh += dt;
    if (sinceRefresh >= 5) {
      mods = globalModifiers(s);
      sinceRefresh = 0;
    }
  }
  return total;
}
