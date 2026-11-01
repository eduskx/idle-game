import { z } from 'zod';
import { SAVE_VERSION } from '../engine/state';

/**
 * Runtime validation for save data. Everything that comes from storage or a
 * pasted import string is untrusted input and must pass this schema before the
 * game touches it.
 */
const finite = z.number().refine(Number.isFinite, 'must be finite');
const nonNeg = finite.refine((n) => n >= 0, 'must be >= 0');
const int = z.number().int().nonnegative();
const id = z.string().regex(/^[a-zA-Z0-9]{1,40}$/);

const ownedCreature = z.object({
  defId: id,
  level: int.min(1).max(10_000),
  xp: nonNeg,
  stars: int.max(10),
  shards: int.max(10_000),
});

export const saveSchema = z.object({
  version: z.literal(SAVE_VERSION),
  rngState: z.number().int(),
  currencies: z.object({ gold: nonNeg, essence: nonNeg, seeds: nonNeg }),
  creatures: z.record(id, ownedCreature),
  team: z.array(id).min(1).max(10),
  upgrades: z.record(id, int),
  talents: z.record(id, int),
  achievements: z.array(id).max(500),
  charms: z.record(id, int.max(1000)),
  expeditions: z
    .array(
      z.object({
        defId: id,
        durationId: z.enum(['short', 'medium', 'long', 'epic']),
        startedAt: nonNeg,
      }),
    )
    .max(10),
  battle: z.object({
    stage: int.min(1),
    autoAdvance: z.boolean(),
  }),
  runHighestStage: int.min(1),
  lifetime: z.object({
    kills: nonNeg,
    bossKills: nonNeg,
    goldEarned: nonNeg,
    summons: nonNeg,
    reblooms: nonNeg,
    highestStage: int.min(1),
    playSeconds: nonNeg,
  }),
  settings: z.object({
    language: z.enum(['de', 'en']),
    reducedMotion: z.boolean(),
    showDamageNumbers: z.boolean(),
  }),
  avatar: z.object({
    skin: int.max(100),
    hairColor: int.max(100),
    items: z.object({
      hair: id,
      top: id,
      bottom: id,
      shoes: id,
      hat: id,
      accessory: id,
    }),
  }),
  lastSeen: nonNeg,
  createdAt: nonNeg,
});

export type SaveData = z.infer<typeof saveSchema>;
