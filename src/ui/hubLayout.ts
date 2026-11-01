import { CREATURE_BY_ID, SIZE_SCALE } from '../data/creatures';
import type { SizeClass } from '../engine/types';

/**
 * Hub scene layout: the team stands on the meadow like a group photo. Big species stand in
 * the back rows, small ones up front, so an Eclipse Wyrm never hides a Teacup. Rows are far
 * enough apart that a front creature only overlaps the feet of the one behind it.
 */

/** Sprite edge in px for an M creature in the front row (scaled by size class and depth). */
export const HUB_BASE_SIZE = 108;
/** The hub shows at most this many team members (= the maximum team size). */
export const HUB_MAX = 6;

interface Slot {
  /** Horizontal center in % of the scene width. */
  x: number;
  /** Feet position in px from the scene bottom. */
  bottom: number;
  /** Row index, 0 = furthest back. */
  row: number;
  /** Perspective factor: back rows render smaller. */
  depth: number;
}

const BACK = { bottom: 118, depth: 0.78 };
const BACK3 = { bottom: 130, depth: 0.74 };
const MID = { bottom: 72, depth: 0.8 };
const FRONT = { bottom: 12, depth: 1 };

function row(r: number, spec: { bottom: number; depth: number }, xs: number[]): Slot[] {
  return xs.map((x) => ({ x, bottom: spec.bottom, depth: spec.depth, row: r }));
}

/**
 * Slot sets per team size. The avatar stands front-left (0–28 %), so the team uses the right
 * part of the scene; rows are staggered so nobody stands right behind someone else.
 */
const SLOT_SETS: Slot[][] = [
  [],
  row(0, FRONT, [62]),
  [...row(0, { bottom: 92, depth: 0.86 }, [74]), ...row(1, FRONT, [50])],
  [...row(0, { bottom: 104, depth: 0.82 }, [64]), ...row(1, FRONT, [44, 82])],
  [...row(0, BACK, [52, 82]), ...row(1, FRONT, [40, 68])],
  [...row(0, BACK3, [54, 84]), ...row(1, MID, [70]), ...row(2, FRONT, [42, 88])],
  [...row(0, BACK, [46, 67, 88]), ...row(1, FRONT, [38, 61, 84])],
];

const SIZE_RANK: Record<SizeClass, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4 };

export interface HubPlacement {
  id: string;
  /** Index in the team (0 = leader). */
  index: number;
  /** Horizontal center in % of the scene width. */
  x: number;
  bottom: number;
  /** Sprite base size, passed to `<Sprite scale="stage">` (which applies the size class). */
  size: number;
  zIndex: number;
  depth: 'front' | 'mid' | 'back';
}

function sizeOf(id: string): SizeClass {
  return CREATURE_BY_ID[id]?.size ?? 'M';
}

/**
 * Places up to {@link HUB_MAX} team members: sorted by size class (biggest first, team order
 * breaks ties), the biggest get the back row and its central slots. Within a row the smaller
 * creature is drawn on top. `sceneWidth` (px) keeps every sprite inside the scene.
 */
export function hubLayout(team: readonly string[], sceneWidth = 358): HubPlacement[] {
  const members = team.slice(0, HUB_MAX).map((id, index) => ({ id, index, rank: SIZE_RANK[sizeOf(id)] }));
  const slots = SLOT_SETS[members.length] ?? [];
  const rows = slots.reduce((max, s) => Math.max(max, s.row + 1), 0);

  // Back rows first; inside a row, the slot nearest the row's center first.
  const ordered = [...slots].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    const xs = slots.filter((s) => s.row === a.row).map((s) => s.x);
    const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
    return Math.abs(a.x - mid) - Math.abs(b.x - mid) || a.x - b.x;
  });
  const bySize = [...members].sort((a, b) => b.rank - a.rank || a.index - b.index);

  return bySize
    .map((m, i) => {
      const slot = ordered[i]!;
      const size = Math.round(HUB_BASE_SIZE * slot.depth);
      const half = ((size * SIZE_SCALE[sizeOf(m.id)]) / 2 / sceneWidth) * 100;
      const x = Math.min(100 - half, Math.max(half, slot.x));
      const fromFront = rows - 1 - slot.row;
      return {
        id: m.id,
        index: m.index,
        x: Math.round(x * 10) / 10,
        bottom: slot.bottom,
        size,
        // Rows stack back to front; inside a row smaller species sit on top.
        zIndex: 2 + slot.row * 6 + (4 - m.rank),
        depth: (fromFront === 0 ? 'front' : fromFront === 1 && rows === 3 ? 'mid' : 'back') as
          'front' | 'mid' | 'back',
      };
    })
    .sort((a, b) => a.index - b.index);
}
