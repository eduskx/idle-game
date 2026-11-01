import type { CSSProperties } from 'react';
import { AVATAR_HAIR_COLORS, AVATAR_SKIN_TONES, AVATAR_SLOTS, avatarItem } from '../../data/avatar';
import type { AvatarSlot, AvatarState } from '../../engine/types';
import {
  BodyBack,
  Face,
  HAIR_PARTS,
  Hands,
  Head,
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
 * The player's paper-doll avatar: one shared pose, parts stacked in fixed layers.
 * Skin, hair and clothing colors are passed in as CSS variables.
 */
export function Avatar({
  avatar,
  viewBox = SLOT_VIEWBOX.full,
  className,
  label,
}: {
  avatar: AvatarState;
  viewBox?: string;
  className?: string;
  label?: string;
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

  const hatOn = avatar.items.hat !== 'none';
  const parts: PartArt[] = [
    HAIR_PARTS[avatar.items.hair]?.(hatOn) ?? {},
    ...(['top', 'bottom', 'shoes', 'hat', 'accessory'] as const).map(
      (slot) => PARTS_BY_SLOT[slot][avatar.items[slot]] ?? {},
    ),
  ];
  const layer = (name: Layer) => parts.map((p, i) => p[name] && <g key={`${name}${i}`}>{p[name]}</g>);

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
      <BodyBack />
      {layer('bottom')}
      {layer('shoes')}
      <Torso />
      {layer('top')}
      <Hands />
      {layer('neck')}
      <Head />
      <Face />
      {layer('hairFront')}
      {layer('hat')}
      {layer('face')}
    </svg>
  );
}
