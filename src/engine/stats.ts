import { getCreature } from '../data/creatures';
import { ACHIEVEMENT_BONUS } from '../data/progression';
import { charmBonus, typeCharmBonus } from './charms';
import { BALANCE, creatureLevelMult, milestoneMult } from './formulas';
import type { AbilityKind, CreatureType, GameState, Realm } from './types';
import { BOSS_TIME } from './types';

export interface GlobalModifiers {
  atk: number;
  hp: number;
  gold: number;
  xp: number;
  essence: number;
  seeds: number;
  critChance: number;
  speed: number;
  offlineHours: number;
  /** Seconds available to defeat a boss. */
  bossTime: number;
  teamSlots: number;
  synergy: Synergy;
}

export type Synergy = { kind: 'none' } | { kind: 'pure'; realm: Realm } | { kind: 'twilight' };

export interface TeamMemberStats {
  defId: string;
  types: readonly CreatureType[];
  realm: Realm;
  maxHp: number;
  atk: number;
  speed: number;
  critChance: number;
  ability: AbilityKind;
  abilityValue: number;
}

export function teamSlots(s: GameState): number {
  return BALANCE.baseTeamSlots + (s.upgrades.pack ?? 0) + (s.talents.bigPack ?? 0);
}

export function synergyOf(team: string[]): Synergy {
  if (team.length < 2) return { kind: 'none' };
  const realms = team.map((id) => getCreature(id).realm);
  const hearth = realms.filter((r) => r === 'hearth').length;
  const umbra = realms.length - hearth;
  if (team.length >= 3 && (hearth === 0 || umbra === 0)) {
    return { kind: 'pure', realm: hearth > 0 ? 'hearth' : 'umbra' };
  }
  if (hearth > 0 && umbra > 0 && Math.abs(hearth - umbra) <= 1) return { kind: 'twilight' };
  return { kind: 'none' };
}

export function globalModifiers(s: GameState): GlobalModifiers {
  const u = s.upgrades;
  const t = s.talents;
  const synergy = synergyOf(s.team);
  const achievementMult = 1 + ACHIEVEMENT_BONUS * s.achievements.length;

  let atk =
    milestoneMult(u.sharpen, 0.2) *
    1.08 ** t.rootStrength *
    achievementMult *
    (1 + charmBonus(s, 'wolfFang'));
  let hp = milestoneMult(u.vitality, 0.2) * 1.08 ** t.barkSkin * (1 + charmBonus(s, 'amberHeart'));
  let gold = milestoneMult(u.greed, 0.15) * 1.1 ** t.goldenSap * (1 + charmBonus(s, 'luckyClover'));
  let xp = milestoneMult(u.wisdom, 0.15) * 1.1 ** t.deepRoots * (1 + charmBonus(s, 'owlFeather'));
  let essence = (1 + 0.1 * t.nightBloom) * (1 + charmBonus(s, 'moonstone'));
  const seeds = 1 + 0.1 * t.seedRain;
  let critChance = BALANCE.baseCritChance + 0.01 * u.focus;
  let speed = 1 + 0.02 * u.swiftness + 0.02 * t.swiftWind;

  if (synergy.kind === 'pure') {
    const bonus = 1 + BALANCE.pureRealmBonus + 0.05 * t.kinship;
    atk *= bonus;
    hp *= bonus;
  } else if (synergy.kind === 'twilight') {
    const bonus = 1 + BALANCE.twilightBonus + 0.05 * t.twilight;
    gold *= bonus;
    xp *= bonus;
  }

  // Team-wide passive abilities
  for (const id of s.team) {
    const def = getCreature(id);
    const owned = s.creatures[id];
    const starBoost = 1 + 0.1 * (owned?.stars ?? 0);
    const v = def.ability.value * starBoost;
    switch (def.ability.kind) {
      case 'goldFind':
        gold *= 1 + v;
        break;
      case 'xpFind':
        xp *= 1 + v;
        break;
      case 'essenceFind':
        essence *= 1 + v;
        break;
      case 'haste':
        speed += v;
        break;
      default:
        break;
    }
  }

  critChance = Math.min(critChance, 0.95);

  return {
    atk,
    hp,
    gold,
    xp,
    essence,
    seeds,
    critChance,
    speed,
    offlineHours: BALANCE.baseOfflineHours + t.longDream,
    bossTime: BOSS_TIME + charmBonus(s, 'hourglass'),
    teamSlots: teamSlots(s),
    synergy,
  };
}

export function memberStats(s: GameState, defId: string, mods: GlobalModifiers): TeamMemberStats {
  const def = getCreature(defId);
  const owned = s.creatures[defId];
  if (!owned) throw new Error(`Creature not owned: ${defId}`);
  const lv = creatureLevelMult(owned);
  const starBoost = 1 + 0.1 * owned.stars;
  const abilityValue = def.ability.value * starBoost;
  const tauntHp = def.ability.kind === 'taunt' ? 1 + abilityValue : 1;
  const crit = def.ability.kind === 'crit' ? abilityValue : 0;
  return {
    defId,
    types: def.types,
    realm: def.realm,
    maxHp: def.baseHp * lv.hp * mods.hp * tauntHp,
    atk: def.baseAtk * lv.atk * mods.atk * (1 + typeCharmBonus(s, def.types)),
    speed: def.speed * mods.speed,
    critChance: Math.min(mods.critChance + crit, 0.95),
    ability: def.ability.kind,
    abilityValue,
  };
}

export function teamStats(s: GameState, mods = globalModifiers(s)): TeamMemberStats[] {
  return s.team.filter((id) => s.creatures[id]).map((id) => memberStats(s, id, mods));
}

/** Rough damage-per-second estimate for UI display (ignores types and crit variance). */
export function estimatedDps(s: GameState): number {
  const mods = globalModifiers(s);
  return teamStats(s, mods).reduce(
    (sum, m) => sum + m.atk * m.speed * (1 + m.critChance * (BALANCE.critMult - 1)),
    0,
  );
}
