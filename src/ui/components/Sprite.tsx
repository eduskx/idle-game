import { memo, useId } from 'react';
import type { CreatureLook, Realm } from '../../engine/types';

/**
 * Custom art overrides. Drop `<id>.svg|png|webp` into src/assets/creatures/ and it
 * replaces the procedural placeholder automatically (see docs/ART_GUIDE.md).
 */
const overrides = import.meta.glob<string>('../../assets/creatures/*.{svg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const ART: Record<string, string> = Object.fromEntries(
  Object.entries(overrides).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.\w+$/, ''),
    url,
  ]),
);

interface SpriteProps {
  id: string;
  look: CreatureLook;
  realm: Realm;
  size?: number;
  flip?: boolean;
  dim?: boolean;
  label?: string;
}

function bodyPath(body: CreatureLook['body']): string {
  switch (body) {
    case 'tall':
      return 'M30 92 C22 92 20 80 22 60 C24 34 36 22 50 22 C64 22 76 34 78 60 C80 80 78 92 70 92 Z';
    case 'wide':
      return 'M14 90 C6 90 6 70 12 60 C20 44 34 40 50 40 C66 40 80 44 88 60 C94 70 94 90 86 90 Z';
    case 'spiky':
      return 'M22 92 L18 70 L10 64 L22 58 L20 42 L34 44 L40 28 L50 40 L60 28 L66 44 L80 42 L78 58 L90 64 L82 70 L78 92 Z';
    case 'round':
      return 'M50 30 C72 30 86 46 86 64 C86 84 72 92 50 92 C28 92 14 84 14 64 C14 46 28 30 50 30 Z';
    case 'blob':
    default:
      return 'M20 90 C10 90 12 72 16 62 C22 44 34 34 50 34 C66 34 78 44 84 62 C88 72 90 90 80 90 C72 90 70 84 64 88 C58 92 42 92 36 88 C30 84 28 90 20 90 Z';
  }
}

function Ears({ ears, fill, stroke }: { ears: CreatureLook['ears']; fill: string; stroke: string }) {
  const common = { fill, stroke, strokeWidth: 2.5, strokeLinejoin: 'round' as const };
  switch (ears) {
    case 'cat':
      return (
        <g {...common}>
          <path d="M28 44 L30 22 L44 36 Z" />
          <path d="M72 44 L70 22 L56 36 Z" />
        </g>
      );
    case 'bunny':
      return (
        <g {...common}>
          <ellipse cx="38" cy="18" rx="6" ry="18" />
          <ellipse cx="62" cy="18" rx="6" ry="18" />
        </g>
      );
    case 'horns':
      return (
        <g fill="#2a2235" stroke={stroke} strokeWidth={2}>
          <path d="M32 40 C24 30 24 18 30 10 C32 22 38 30 40 36 Z" />
          <path d="M68 40 C76 30 76 18 70 10 C68 22 62 30 60 36 Z" />
        </g>
      );
    case 'antlers':
      return (
        <g fill="none" stroke="#8a6a4a" strokeWidth={3} strokeLinecap="round">
          <path d="M38 34 L32 16 M34 22 L26 18 M33 18 L36 8" />
          <path d="M62 34 L68 16 M66 22 L74 18 M67 18 L64 8" />
        </g>
      );
    case 'leaf':
      return (
        <path
          d="M50 34 C44 22 48 10 60 6 C62 18 58 28 50 34 Z"
          fill="#6cbf5a"
          stroke={stroke}
          strokeWidth={2}
        />
      );
    case 'none':
    default:
      return null;
  }
}

function Eyes({ eyes, glow, gf }: { eyes: CreatureLook['eyes']; glow: string; gf: string }) {
  switch (eyes) {
    case 'big':
      return (
        <g>
          <circle cx="38" cy="62" r="8" fill="#fff" />
          <circle cx="62" cy="62" r="8" fill="#fff" />
          <circle cx="39" cy="63" r="4.5" fill="#1d1b26" />
          <circle cx="63" cy="63" r="4.5" fill="#1d1b26" />
          <circle cx="41" cy="60" r="1.6" fill="#fff" />
          <circle cx="65" cy="60" r="1.6" fill="#fff" />
        </g>
      );
    case 'sleepy':
      return (
        <g stroke="#1d1b26" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d="M31 63 Q38 68 45 63" />
          <path d="M55 63 Q62 68 69 63" />
        </g>
      );
    case 'glow':
      return (
        <g fill={glow} filter={gf}>
          <ellipse cx="38" cy="62" rx="6" ry="4" />
          <ellipse cx="62" cy="62" rx="6" ry="4" />
        </g>
      );
    case 'three':
      return (
        <g fill={glow}>
          <circle cx="34" cy="64" r="4" />
          <circle cx="50" cy="56" r="5" />
          <circle cx="66" cy="64" r="4" />
        </g>
      );
    case 'dot':
    default:
      return (
        <g fill="#1d1b26">
          <circle cx="38" cy="62" r="3.5" />
          <circle cx="62" cy="62" r="3.5" />
        </g>
      );
  }
}

function Extra({
  extra,
  fill,
  stroke,
  glow,
  gf,
}: {
  extra: CreatureLook['extra'];
  fill: string;
  stroke: string;
  glow: string;
  gf: string;
}) {
  switch (extra) {
    case 'tail':
      return (
        <path
          d="M82 82 C96 80 98 64 90 58 C92 70 86 76 78 76 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={2.5}
        />
      );
    case 'wings':
      return (
        <g fill={fill} fillOpacity={0.6} stroke={stroke} strokeWidth={2}>
          <path d="M18 60 C4 50 2 34 8 26 C14 40 20 46 26 50 Z" />
          <path d="M82 60 C96 50 98 34 92 26 C86 40 80 46 74 50 Z" />
        </g>
      );
    case 'flame':
      return (
        <path
          d="M50 30 C42 22 46 12 52 4 C54 14 62 16 58 26 C56 30 54 31 50 30 Z"
          fill="#ff8a3c"
          stroke="#c4421a"
          strokeWidth={2}
        />
      );
    case 'mushroom':
      return (
        <g stroke={stroke} strokeWidth={2.5}>
          <path d="M22 40 C22 22 78 22 78 40 Z" fill="#d94a4a" />
          <circle cx="38" cy="32" r="3" fill="#fff" stroke="none" />
          <circle cx="58" cy="30" r="4" fill="#fff" stroke="none" />
        </g>
      );
    case 'halo':
      return <ellipse cx="50" cy="14" rx="18" ry="5" fill="none" stroke={glow} strokeWidth={3} filter={gf} />;
    case 'none':
    default:
      return null;
  }
}

/** Procedural placeholder art: a friendly blob for Hearth, a darker glowing one for Umbra. */
export const Sprite = memo(function Sprite({ id, look, realm, size = 96, flip, dim, label }: SpriteProps) {
  const rawId = useId();
  const custom = ART[id];
  const style = { transform: flip ? 'scaleX(-1)' : undefined, opacity: dim ? 0.35 : 1 };
  if (custom) {
    return <img src={custom} width={size} height={size} alt={label ?? ''} style={style} draggable={false} />;
  }
  const umbra = realm === 'umbra';
  const fill = umbra ? `hsl(${look.hue} 35% 32%)` : `hsl(${look.hue} 65% 72%)`;
  const belly = umbra ? `hsl(${look.hue} 30% 42%)` : `hsl(${look.hue} 70% 86%)`;
  const stroke = umbra ? `hsl(${look.hue} 40% 14%)` : `hsl(${look.hue} 40% 35%)`;
  const glow = umbra ? `hsl(${(look.hue + 180) % 360} 100% 70%)` : '#ffe9a8';
  const filterId = `glow${rawId.replace(/:/g, '')}`;
  const gf = `url(#${filterId})`;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      style={style}
      className={umbra ? 'sprite sprite-umbra' : 'sprite sprite-hearth'}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="94" rx="30" ry="4" fill="#000" opacity={0.18} />
      <Extra
        extra={
          look.extra === 'halo' || look.extra === 'flame' || look.extra === 'mushroom' ? 'none' : look.extra
        }
        fill={fill}
        stroke={stroke}
        glow={glow}
        gf={gf}
      />
      <Ears ears={look.ears} fill={fill} stroke={stroke} />
      <path d={bodyPath(look.body)} fill={fill} stroke={stroke} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx="50" cy="78" rx="18" ry="10" fill={belly} opacity={0.8} />
      <Eyes eyes={look.eyes} glow={glow} gf={gf} />
      {!umbra && (
        <g fill="#ff8fa3" opacity={0.55}>
          <ellipse cx="28" cy="72" rx="5" ry="3" />
          <ellipse cx="72" cy="72" rx="5" ry="3" />
        </g>
      )}
      {(look.extra === 'halo' || look.extra === 'flame' || look.extra === 'mushroom') && (
        <Extra extra={look.extra} fill={fill} stroke={stroke} glow={glow} gf={gf} />
      )}
    </svg>
  );
});
