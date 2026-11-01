import type { ReactNode } from 'react';

/** Small two-tone glyphs for the gold upgrades: white body, details in the tile's dark ink. */
const INK = 'var(--up-ink)';
const W = '#fffaf0';

const GLYPHS: Record<string, ReactNode> = {
  // three claw slashes
  sharpen: (
    <g fill="none" strokeLinecap="round">
      <g stroke={INK} strokeWidth={6}>
        <path d="M9 25 Q14 15 22 7" />
        <path d="M14 27 Q19 18 26 11" />
        <path d="M6 20 Q10 12 16 6" />
      </g>
      <g stroke={W} strokeWidth={3}>
        <path d="M9 25 Q14 15 22 7" />
        <path d="M14 27 Q19 18 26 11" />
        <path d="M6 20 Q10 12 16 6" />
      </g>
    </g>
  ),
  // steaming bowl
  vitality: (
    <g>
      <path
        d="M11 9 q-2 -2 0 -4 M16 9 q-2 -2 0 -4 M21 9 q-2 -2 0 -4"
        stroke={W}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M4 14 L28 14 Q27 26 16 26 Q5 26 4 14 Z"
        fill={W}
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M8 17 L24 17" stroke={INK} strokeWidth={1.6} opacity={0.6} />
      <circle cx={12} cy={12.5} r={2.2} fill="#ff7a5a" />
      <circle cx={18} cy={12} r={2} fill="#7bd36a" />
      <rect x={11} y={26} width={10} height={2.5} rx={1} fill={INK} />
    </g>
  ),
  // drawstring pouch with a coin
  greed: (
    <g strokeLinejoin="round">
      <path
        d="M12 8 Q16 11 20 8 L19 11 Q27 15 26 22 Q25 28 16 28 Q7 28 6 22 Q5 15 13 11 Z"
        fill={W}
        stroke={INK}
        strokeWidth={2}
      />
      <path d="M12 11.5 L20 11.5" stroke={INK} strokeWidth={1.8} />
      <circle cx={21} cy={7} r={4} fill="#ffd34a" stroke={INK} strokeWidth={1.6} />
      <path d="M13 20 l3 -3 l3 3 l-3 3 z" fill={INK} opacity={0.7} />
    </g>
  ),
  // open scroll
  wisdom: (
    <g strokeLinejoin="round">
      <rect x={7} y={7} width={18} height={19} rx={1.5} fill={W} stroke={INK} strokeWidth={2} />
      <rect x={4} y={4.5} width={24} height={4.5} rx={2.2} fill={W} stroke={INK} strokeWidth={2} />
      <rect x={4} y={24} width={24} height={4.5} rx={2.2} fill={W} stroke={INK} strokeWidth={2} />
      <path d="M11 13 H21 M11 17 H19 M11 21 H17" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  ),
  // target with an arrow in the bull's-eye
  focus: (
    <g>
      <circle cx={15} cy={17} r={11} fill={W} stroke={INK} strokeWidth={2} />
      <circle cx={15} cy={17} r={6.5} fill="none" stroke={INK} strokeWidth={2} />
      <circle cx={15} cy={17} r={2.4} fill="#ff6a5a" />
      <path d="M15 17 L27 5" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M24 4 L28 4 L28 8 Z M23 3 L27 3 M29 7 L29 11" stroke={INK} strokeWidth={1.6} fill={INK} />
    </g>
  ),
  // gust lines
  swiftness: (
    <g fill="none" strokeLinecap="round">
      <g stroke={INK} strokeWidth={5.5}>
        <path d="M4 11 H20 Q25 11 25 7 Q25 4 22 4" />
        <path d="M4 17 H26 Q29 17 29 20" />
        <path d="M6 23 H17 Q21 23 21 27 Q21 29 19 29" />
      </g>
      <g stroke={W} strokeWidth={2.6}>
        <path d="M4 11 H20 Q25 11 25 7 Q25 4 22 4" />
        <path d="M4 17 H26 Q29 17 29 20" />
        <path d="M6 23 H17 Q21 23 21 27 Q21 29 19 29" />
      </g>
    </g>
  ),
  // paw print
  pack: (
    <g fill={W} stroke={INK} strokeWidth={1.8}>
      <path d="M16 15 Q23 15 24 22 Q24 27 19 26 Q16 25 13 26 Q8 27 8 22 Q9 15 16 15 Z" />
      <ellipse cx={7} cy={13} rx={3} ry={3.8} />
      <ellipse cx={12.5} cy={7.5} rx={3} ry={3.8} />
      <ellipse cx={19.5} cy={7.5} rx={3} ry={3.8} />
      <ellipse cx={25} cy={13} rx={3} ry={3.8} />
    </g>
  ),
};

export function UpgradeIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 32 32" width={34} height={34} aria-hidden="true">
      {GLYPHS[id]}
    </svg>
  );
}
