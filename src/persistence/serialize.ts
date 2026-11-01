import { CHARM_BY_ID, type CharmId } from '../data/charms';
import { CREATURE_BY_ID, STARTER_CREATURES } from '../data/creatures';
import { defaultAvatar, sanitizeAvatar } from '../engine/avatar';
import { emptyTalents, emptyUpgrades, newBattle, newOwnedCreature, SAVE_VERSION } from '../engine/state';
import type { GameState } from '../engine/types';
import { migrate } from './migrations';
import { saveSchema, type SaveData } from './schema';

/** Strips runtime-only data (current enemy, combat log) before saving. */
export function toSaveData(s: GameState): SaveData {
  return {
    version: s.version as typeof SAVE_VERSION,
    rngState: s.rngState,
    currencies: { ...s.currencies },
    creatures: structuredClone(s.creatures),
    team: [...s.team],
    upgrades: { ...s.upgrades },
    talents: { ...s.talents },
    achievements: [...s.achievements],
    charms: { ...s.charms },
    expeditions: s.expeditions.map((e) => ({ ...e })),
    battle: { stage: s.battle.stage, autoAdvance: s.battle.autoAdvance },
    runHighestStage: s.runHighestStage,
    lifetime: { ...s.lifetime },
    settings: { ...s.settings },
    avatar: { skin: s.avatar.skin, hairColor: s.avatar.hairColor, items: { ...s.avatar.items } },
    lastSeen: s.lastSeen,
    createdAt: s.createdAt,
  };
}

export class SaveError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'SaveError';
  }
}

/** Validates and hydrates untrusted data into a GameState. Throws SaveError. */
export function fromUnknown(raw: unknown): GameState {
  const migrated = migrate(raw);
  const parsed = saveSchema.safeParse(migrated);
  if (!parsed.success) {
    throw new SaveError('Invalid save data', { cause: parsed.error });
  }
  const d = parsed.data;
  // Drop unknown creatures (e.g. removed in a later version) instead of crashing.
  const creatures = Object.fromEntries(
    Object.entries(d.creatures).filter(([key, c]) => CREATURE_BY_ID[key] && c.defId === key),
  );
  // Creatures removed from the roster (e.g. the 30 → 10 redesign) are dropped above; make
  // sure the player always keeps the starters and a usable team.
  for (const starter of STARTER_CREATURES) {
    if (!creatures[starter]) creatures[starter] = newOwnedCreature(starter);
  }
  let team = d.team.filter((tid) => creatures[tid] && !d.expeditions.some((e) => e.defId === tid));
  if (team.length === 0) team = [...STARTER_CREATURES];

  const upgrades = emptyUpgrades();
  for (const key of Object.keys(upgrades) as (keyof typeof upgrades)[]) upgrades[key] = d.upgrades[key] ?? 0;
  const talents = emptyTalents();
  for (const key of Object.keys(talents) as (keyof typeof talents)[]) talents[key] = d.talents[key] ?? 0;

  const battle = newBattle(d.battle.stage);
  battle.autoAdvance = d.battle.autoAdvance;

  const state: GameState = {
    version: SAVE_VERSION,
    rngState: d.rngState,
    currencies: d.currencies,
    creatures,
    team,
    upgrades,
    talents,
    achievements: [...new Set(d.achievements)],
    charms: Object.fromEntries(
      Object.entries(d.charms)
        .filter(([key]) => key in CHARM_BY_ID)
        .map(([key, lvl]) => [key, Math.min(lvl, CHARM_BY_ID[key as CharmId].maxLevel)]),
    ),
    // Expeditions of creatures that no longer exist are dropped; at most one per creature.
    expeditions: d.expeditions.filter(
      (e, i, all) => creatures[e.defId] && all.findIndex((o) => o.defId === e.defId) === i,
    ),
    battle,
    runHighestStage: d.runHighestStage,
    lifetime: d.lifetime,
    settings: d.settings,
    avatar: defaultAvatar(),
    lastSeen: d.lastSeen,
    createdAt: d.createdAt,
  };
  // Unlocks depend on achievements and lifetime stats, so the avatar is checked last.
  state.avatar = sanitizeAvatar(state, d.avatar);
  return state;
}

// ---------------------------------------------------------------- Export strings

const EXPORT_PREFIX = 'HB1.';

/** FNV-1a 32-bit. Detects typos/corruption in export strings; not a security measure. */
function checksum(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): string {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function exportSave(s: GameState): string {
  const json = JSON.stringify(toSaveData(s));
  return `${EXPORT_PREFIX}${checksum(json)}.${toBase64(json)}`;
}

/** Max accepted export string length, guards against pasting huge payloads. */
const MAX_IMPORT_LENGTH = 200_000;

export function importSave(text: string): GameState {
  const trimmed = text.trim();
  if (trimmed.length > MAX_IMPORT_LENGTH) throw new SaveError('Import too large');
  if (!trimmed.startsWith(EXPORT_PREFIX)) throw new SaveError('Unknown format');
  const rest = trimmed.slice(EXPORT_PREFIX.length);
  const dot = rest.indexOf('.');
  if (dot < 0) throw new SaveError('Malformed import');
  const sum = rest.slice(0, dot);
  let json: string;
  try {
    json = fromBase64(rest.slice(dot + 1));
  } catch (e) {
    throw new SaveError('Malformed import', { cause: e });
  }
  if (checksum(json) !== sum) throw new SaveError('Checksum mismatch');
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (e) {
    throw new SaveError('Malformed import', { cause: e });
  }
  return fromUnknown(raw);
}
