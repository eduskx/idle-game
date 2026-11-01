import type { CSSProperties } from 'react';
import { AVATAR_HAIR_COLORS, AVATAR_SKIN_TONES, AVATAR_SLOTS, avatarItem } from '../../data/avatar';
import type { AvatarSlot, AvatarState } from '../../engine/types';
import {
  BACK_VIEW_BY_SLOT,
  BodyBack,
  Face,
  HAIR_BACK_VIEW,
  HAIR_PARTS,
  Hands,
  Head,
  HeadBack,
  PARTS_BY_SLOT,
  Torso,
  type Layer,
  type PartArt,
} from './parts';

/** Crops used for wardrobe thumbnails, so each tile shows the part it is about. */
export const SLOT_VIEWBOX: Record<AvatarSlot | 'full', string> = {
  full: '0 0 200 300',
  hair: '22 14 156 156',
  hat: '22 -6 156 156',
  accessory: '40 50 120 160',
  top: '44 120 112 112',
  bottom: '40 176 120 108',
  shoes: '50 226 100 66',
};

/**
 * Square crops around a single piece (measured with getBBox, ~14 % margin). Locked wardrobe tiles
 * draw only the piece, so they zoom in on it: a brooch would be a speck in its slot's crop.
 */
export const PIECE_VIEWBOX: Record<string, string> = {
  short: '32 2 135 135',
  bob: '30 22 141 141',
  braids: '14 30 171 171',
  bun: '32 7 135 135',
  veil: '0 24 201 201',
  tee: '59 143 82 82',
  vest: '59 143 82 82',
  knit: '55 138 90 90',
  shroud: '-10 14 219 219',
  shorts: '62 186 75 75',
  trousers: '64 200 73 73',
  patchskirt: '50 178 100 100',
  nightwrap: '56 192 87 87',
  sneakers: '64 235 74 74',
  boots: '61 220 79 79',
  slippers: '64 238 71 71',
  clawboots: '48 210 105 105',
  bobble: '36 -9 128 128',
  sprout: '63 -3 78 78',
  crescent: '20 -36 160 160',
  glasses: '50 58 100 100',
  scarf: '64 142 70 70',
  mothpin: '92 158 41 41',
};

/**
 * The player's paper-doll avatar: one shared pose, parts stacked in fixed layers.
 * Skin, hair and clothing colors are passed in as CSS variables.
 */
export function Avatar({
  avatar,
  viewBox = SLOT_VIEWBOX.full,
  className,
  label,
  only,
  view = 'front',
}: {
  avatar: AvatarState;
  viewBox?: string;
  className?: string;
  label?: string;
  /** Draw just this slot's piece, without body, face or other clothes (locked wardrobe tiles). */
  only?: AvatarSlot;
  /** 'back' draws the avatar from behind (battle stage). */
  view?: 'front' | 'back';
}) {
  const skin = AVATAR_SKIN_TONES[avatar.skin] ?? AVATAR_SKIN_TONES[0]!;
  const hair = AVATAR_HAIR_COLORS[avatar.hairColor] ?? AVATAR_HAIR_COLORS[0]!;
  const vars: Record<string, string> = {
    '--av-skin': skin[0],
    '--av-skin-2': skin[1],
    '--av-hair': hair[0],
    '--av-hair-2': hair[1],
  };
  for (const slot of AVATAR_SLOTS) {
    const colors = avatarItem(slot, avatar.items[slot])?.colors;
    if (!colors) continue;
    colors.forEach((col, i) => (vars[`--av-${slot}-${i + 1}`] = col));
  }

  const back = view === 'back';
  const hairArt = back ? HAIR_BACK_VIEW : HAIR_PARTS;
  const slotArt = back ? BACK_VIEW_BY_SLOT : PARTS_BY_SLOT;
  const hatOn = avatar.items.hat !== 'none' && only !== 'hair';
  const parts: PartArt[] = only
    ? [
        only === 'hair'
          ? (hairArt[avatar.items.hair]?.(false) ?? {})
          : (slotArt[only][avatar.items[only]] ?? {}),
      ]
    : [
        hairArt[avatar.items.hair]?.(hatOn) ?? {},
        ...(['top', 'bottom', 'shoes', 'hat', 'accessory'] as const).map(
          (slot) => slotArt[slot][avatar.items[slot]] ?? {},
        ),
      ];
  const body = !only;
  const layer = (name: Layer) => parts.map((p, i) => p[name] && <g key={`${name}${i}`}>{p[name]}</g>);

  if (back) {
    return (
      <svg viewBox={viewBox} className={className} style={vars as CSSProperties} aria-hidden="true">
        {body && <BodyBack />}
        {layer('bottom')}
        {layer('shoes')}
        {body && <Torso />}
        {layer('top')}
        {body && <Hands />}
        {layer('neck')}
        {body && <HeadBack />}
        {layer('face')}
        {layer('hairBack')}
        {layer('topBack')}
        {layer('hat')}
      </svg>
    );
  }

  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={vars as CSSProperties}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {layer('topBack')}
      {layer('hairBack')}
      {body && <BodyBack />}
      {layer('bottom')}
      {layer('shoes')}
      {body && <Torso />}
      {layer('top')}
      {body && <Hands />}
      {layer('neck')}
      {body && <Head />}
      {body && <Face />}
      {layer('hairFront')}
      {layer('hat')}
      {layer('face')}
    </svg>
  );
}
