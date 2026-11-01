import { memo, useId, type CSSProperties } from 'react';
import { CREATURE_BY_ID, PORTRAIT_SCALE, SIZE_SCALE } from '../../data/creatures';
import { CREATURE_ART, type View } from '../creatures';

/**
 * Custom art overrides. Drop `<id>.svg|png|webp` (front) or `<id>-back.*` (back view)
 * into src/assets/creatures/ and it replaces the built-in art (see docs/ART_GUIDE.md).
 */
const overrides = import.meta.glob<string>('../../assets/creatures/*.{svg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const FILES: Record<string, string> = Object.fromEntries(
  Object.entries(overrides).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.\w+$/, ''),
    url,
  ]),
);

interface SpriteProps {
  /** Creature species id. */
  id: string;
  view?: View;
  size?: number;
  /** Boss specimen: crowned and glowing. */
  alpha?: boolean;
  dim?: boolean;
  label?: string;
  className?: string;
  /**
   * How the species' size class is applied (see CREATURE_BIBLE.md):
   * - `portrait` (default): fixed slot, art shrinks inside it for small species
   * - `stage`: the whole sprite grows/shrinks (battle actors), may overflow the platform
   * - `none`: always fill the slot
   */
  scale?: 'portrait' | 'stage' | 'none';
}

/** Pure helper so the scaling rule can be tested without rendering. */
export function spriteScale(id: string, mode: 'portrait' | 'stage' | 'none'): number {
  const def = CREATURE_BY_ID[id];
  if (!def || mode === 'none') return 1;
  return mode === 'stage' ? SIZE_SCALE[def.size] : PORTRAIT_SCALE[def.size];
}

function Crown() {
  return (
    <svg viewBox="0 0 60 40" className="alpha-crown" aria-hidden="true">
      <path
        d="M4 34 L8 10 L20 22 L30 4 L40 22 L52 10 L56 34 Z"
        fill="#ffcf4a"
        stroke="#7a4a00"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <circle cx="30" cy="22" r="4" fill="#ff4f7a" stroke="#7a4a00" strokeWidth={2} />
    </svg>
  );
}

export const Sprite = memo(function Sprite({
  id,
  view = 'front',
  size = 96,
  alpha,
  dim,
  label,
  className,
  scale = 'portrait',
}: SpriteProps) {
  const uid = useId().replace(/:/g, '');
  const file = FILES[view === 'back' ? `${id}-back` : id];
  const Art = CREATURE_ART[id];
  const classes = ['sprite', alpha ? 'is-alpha' : '', dim ? 'dim' : '', className ?? ''].join(' ').trim();
  const factor = spriteScale(id, scale);
  const box = scale === 'stage' ? Math.round(size * factor) : size;
  const style = {
    width: box,
    height: box,
    '--art-scale': scale === 'portrait' ? factor : 1,
  } as CSSProperties;
  return (
    <span className={classes} role="img" aria-label={label} style={style} data-creature={id}>
      {file ? (
        <img src={file} width={size} height={size} alt="" draggable={false} />
      ) : Art ? (
        <Art uid={`c${uid}`} view={view} />
      ) : null}
      {alpha && <Crown />}
    </span>
  );
});
