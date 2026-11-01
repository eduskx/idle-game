import { STARTER_CREATURES } from '../data/creatures';
import { TALENTS, UPGRADES } from '../data/progression';
import { defaultAvatar } from './avatar';
import { randomSeed } from './rng';
import type { BattleState, GameState, OwnedCreature, TalentId, UpgradeId } from './types';

export const SAVE_VERSION = 3;

export function newOwnedCreature(defId: string): OwnedCreature {
  return { defId, level: 1, xp: 0, stars: 0, shards: 0 };
}

export function emptyUpgrades(): Record<UpgradeId, number> {
  return Object.fromEntries(UPGRADES.map((u) => [u.id, 0])) as Record<UpgradeId, number>;
}

export function emptyTalents(): Record<TalentId, number> {
  return Object.fromEntries(TALENTS.map((t) => [t.id, 0])) as Record<TalentId, number>;
}

export function newBattle(stage = 1): BattleState {
  return {
    stage,
    kills: 0,
    enemy: null,
    teamHp: {},
    attackTimers: {},
    enemyAge: 0,
    bossTimer: null,
    autoAdvance: true,
    log: [],
  };
}

export function createInitialState(now = Date.now(), seed = randomSeed()): GameState {
  const creatures: Record<string, OwnedCreature> = {};
  for (const id of STARTER_CREATURES) creatures[id] = newOwnedCreature(id);
  return {
    version: SAVE_VERSION,
    rngState: seed,
    currencies: { gold: 0, essence: 10, seeds: 0 },
    creatures,
    team: [...STARTER_CREATURES],
    upgrades: emptyUpgrades(),
    talents: emptyTalents(),
    achievements: [],
    charms: {},
    expeditions: [],
    battle: newBattle(),
    runHighestStage: 1,
    lifetime: {
      kills: 0,
      bossKills: 0,
      goldEarned: 0,
      summons: 0,
      reblooms: 0,
      highestStage: 1,
      playSeconds: 0,
    },
    settings: {
      language: detectLanguage(),
      reducedMotion: false,
      showDamageNumbers: true,
    },
    avatar: defaultAvatar(),
    lastSeen: now,
    createdAt: now,
  };
}

function detectLanguage(): 'de' | 'en' {
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de')) {
    return 'de';
  }
  return 'en';
}
