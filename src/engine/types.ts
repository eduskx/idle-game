/**
 * Core domain types for Hollowbloom.
 *
 * The engine is pure TypeScript with no React or browser dependencies, so it can be
 * unit-tested, simulated headlessly (see scripts/simulate.ts) and later reused on a
 * server for cloud-save validation.
 */

export type Realm = 'umbra' | 'hearth';
export type Element = 'ember' | 'tide' | 'grove';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type AbilityKind =
  | 'none'
  | 'lifesteal' // heals self for % of damage dealt
  | 'teamHeal' // heals the most injured ally for % of attack on each hit
  | 'taunt' // takes hits for the team, gets bonus HP
  | 'crit' // extra crit chance
  | 'bossSlayer' // extra damage against bosses
  | 'goldFind' // more gold from kills
  | 'xpFind' // more XP for the whole team
  | 'essenceFind' // more essence drops
  | 'haste' // team attack speed aura
  | 'rage' // damage grows while the enemy survives
  | 'thorns' // reflects damage when hit
  | 'execute'; // bonus damage to low-HP enemies

export interface Ability {
  kind: AbilityKind;
  /** Magnitude, meaning depends on kind (usually a fraction, e.g. 0.1 = 10%). */
  value: number;
}

export interface CreatureDef {
  id: string;
  realm: Realm;
  element: Element;
  rarity: Rarity;
  /** Base stats at level 1, 0 stars. */
  baseAtk: number;
  baseHp: number;
  /** Attacks per second. */
  speed: number;
  ability: Ability;
  /** Zone index (0-based) that must have been reached before this creature can be summoned. */
  unlockZone: number;
  /** Deterministic seed for the procedural placeholder sprite. */
  look: CreatureLook;
}

export interface CreatureLook {
  body: 'blob' | 'tall' | 'wide' | 'spiky' | 'round';
  ears: 'none' | 'cat' | 'bunny' | 'horns' | 'antlers' | 'leaf';
  eyes: 'dot' | 'big' | 'sleepy' | 'glow' | 'three';
  hue: number;
  extra: 'none' | 'tail' | 'wings' | 'flame' | 'mushroom' | 'halo';
}

export interface EnemyDef {
  id: string;
  realm: Realm;
  element: Element;
  hpMult: number;
  atkMult: number;
  look: CreatureLook;
}

export interface ZoneDef {
  id: string;
  realm: Realm;
  /** Enemies that appear in this zone. */
  enemies: string[];
  boss: string;
  /** Background gradient colors. */
  palette: [string, string];
}

/** A creature the player owns. */
export interface OwnedCreature {
  defId: string;
  level: number;
  xp: number;
  stars: number;
  /** Duplicate shards collected towards the next star. */
  shards: number;
}

export interface Fighter {
  defId: string;
  maxHp: number;
  hp: number;
  atk: number;
  speed: number;
  element: Element;
  attackTimer: number;
  isBoss?: boolean;
}

export interface BattleState {
  /** Global stage number, starting at 1. Zone = floor((stage - 1) / STAGES_PER_ZONE). */
  stage: number;
  /** Kills done in the current stage. */
  kills: number;
  enemy: Fighter | null;
  /** Current HP of team members, keyed by creature defId. */
  teamHp: Record<string, number>;
  attackTimers: Record<string, number>;
  /** Seconds the current enemy has been alive (used by rage and boss timers). */
  enemyAge: number;
  /** Remaining seconds for the boss fight, null if no boss. */
  bossTimer: number | null;
  /** When false, the team keeps farming the current stage instead of advancing. */
  autoAdvance: boolean;
  /** Short-lived combat events for the UI (damage numbers etc.). Not persisted. */
  log: CombatEvent[];
}

export type CombatEvent =
  | { t: 'hit'; target: 'enemy' | string; amount: number; crit: boolean; id: number }
  | { t: 'kill'; gold: number; xp: number; essence: number; id: number }
  | { t: 'defeat'; id: number }
  | { t: 'stageClear'; stage: number; id: number }
  | { t: 'bossFail'; id: number };

export type UpgradeId = 'sharpen' | 'vitality' | 'greed' | 'focus' | 'swiftness' | 'wisdom' | 'pack';
export type TalentId =
  | 'rootStrength'
  | 'barkSkin'
  | 'goldenSap'
  | 'deepRoots'
  | 'nightBloom'
  | 'seedRain'
  | 'longDream'
  | 'swiftWind'
  | 'kinship'
  | 'twilight'
  | 'headStart'
  | 'bigPack';

export interface Stats {
  gold: number;
  essence: number;
  seeds: number;
}

export interface Lifetime {
  kills: number;
  bossKills: number;
  goldEarned: number;
  summons: number;
  reblooms: number;
  highestStage: number;
  playSeconds: number;
}

export interface Settings {
  language: 'de' | 'en';
  reducedMotion: boolean;
  showDamageNumbers: boolean;
}

export interface GameState {
  version: number;
  /** Seed for the deterministic RNG; advances with every roll. */
  rngState: number;
  currencies: Stats;
  creatures: Record<string, OwnedCreature>;
  /** Ordered list of creature defIds in the active team. Index 0 is the front. */
  team: string[];
  upgrades: Record<UpgradeId, number>;
  talents: Record<TalentId, number>;
  achievements: string[];
  battle: BattleState;
  /** Highest stage reached in the current run (resets on rebloom). */
  runHighestStage: number;
  lifetime: Lifetime;
  settings: Settings;
  /** Unix ms of the last tick, used for offline progress. */
  lastSeen: number;
  createdAt: number;
}

export const STAGES_PER_ZONE = 50;
export const BOSS_EVERY = 10;
export const KILLS_PER_STAGE = 5;
export const BOSS_TIME = 30;
