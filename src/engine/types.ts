/**
 * Core domain types for Hollowbloom.
 *
 * The engine is pure TypeScript with no React or browser dependencies, so it can be
 * unit-tested, simulated headlessly (see scripts/simulate.ts) and later reused on a
 * server for cloud-save validation.
 */

export type Realm = 'umbra' | 'hearth';
/**
 * The six creature types (see docs/CREATURE_BIBLE.md). Species have one or two;
 * the effectiveness chart lives in formulas.ts.
 */
export type CreatureType = 'ember' | 'tide' | 'grove' | 'stone' | 'gale' | 'shade';
/** Visual size class of a species (see docs/CREATURE_BIBLE.md). Purely cosmetic. */
export type SizeClass = 'XS' | 'S' | 'M' | 'L' | 'XL';
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
  /** One or two types; the first one is the primary type. */
  types: readonly CreatureType[];
  rarity: Rarity;
  archetype: 'bruiser' | 'striker' | 'guardian' | 'support' | 'swift';
  /** Base stats at level 1, 0 stars. */
  baseAtk: number;
  baseHp: number;
  /** Attacks per second. */
  speed: number;
  ability: Ability;
  /** Zone index (0-based) that must have been reached before this creature can be summoned. */
  unlockZone: number;
  /** How big the species is drawn (battle stage and portraits). */
  size: SizeClass;
}

export interface EnemyDef {
  id: string;
  /** The creature species this enemy is a wild member of. */
  species: string;
  /** Alphas are boss specimens. */
  alpha: boolean;
  realm: Realm;
  /** Inherited from the species. */
  types: readonly CreatureType[];
  hpMult: number;
  atkMult: number;
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
  types: readonly CreatureType[];
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
  | {
      t: 'hit';
      target: 'enemy' | string;
      amount: number;
      crit: boolean;
      /** Type effectiveness multiplier of this hit (1 = neutral). */
      eff: number;
      id: number;
    }
  | { t: 'kill'; gold: number; xp: number; essence: number; id: number }
  | { t: 'defeat'; id: number }
  | { t: 'stageClear'; stage: number; id: number }
  | { t: 'bossFail'; id: number }
  | { t: 'charm'; charm: string; id: number };

export interface Expedition {
  defId: string;
  durationId: 'short' | 'medium' | 'long' | 'epic';
  /** Unix ms when the expedition started. */
  startedAt: number;
}

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
  /** Charm levels, keyed by charm id. Kept through rebloom. */
  charms: Record<string, number>;
  expeditions: Expedition[];
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
