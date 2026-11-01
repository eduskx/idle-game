import { useId, type CSSProperties } from 'react';
import { CREATURE_TYPES } from '../../engine';
import { TYPE_GLYPHS } from './TypeChip';

/**
 * Original rune glyphs for the summoning ring, drawn on a 12×12 grid around 0,0 (strokes only).
 * Simple shapes so they stay readable when the ring is foreshortened.
 */
const RUNES = [
  'M-5 5 L0 -5 L5 5',
  'M-4 -5 V5 M-4 0 L4 -5 M-4 0 L4 5',
  'M0 -5 V5 M-5 -1 H5',
  'M-5 5 V-5 L5 5 V-5',
  'M0 -5 L5 0 L0 5 L-5 0 Z',
  'M-5 -3 Q0 7 5 -3 M0 -5 V1',
];

const R_RUNES = 77;

/** A point on a circle of radius r at angle a (degrees, 0 = top, clockwise). */
function polar(r: number, a: number): [number, number] {
  const rad = ((a - 90) * Math.PI) / 180;
  return [Math.round(r * Math.cos(rad) * 10) / 10, Math.round(r * Math.sin(rad) * 10) / 10];
}

function star(r: number, offset: number): string {
  return (
    [0, 1, 2]
      .map((i) => polar(r, offset + i * 120))
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`)
      .join(' ') + ' Z'
  );
}

/**
 * The summoning circle: a rune ring lying on the ground in 2.5D perspective, set into a stone
 * slab, with a light column and rising motes. `color` tints the glow (rarity or type color);
 * the six type glyphs sit in the ring in their own colors. Idle: the rune band turns slowly,
 * the inner star counter-turns and the glow breathes (all gated by `data-motion='full'`).
 */
export function SummonCircle({
  color,
  className,
  size = 220,
}: {
  /** Glow color; omit to inherit `--rc` from the surrounding element. */
  color?: string;
  className?: string;
  size?: number;
}) {
  const glowId = `sc-floor-${useId().replace(/:/g, '')}`;
  return (
    <div
      className={`sc ${className ?? ''}`.trim()}
      style={{ ...(color ? { '--rc': color } : {}), '--sc-size': `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <div className="sc-slab" />
      <div className="sc-plane">
        <svg viewBox="-100 -100 200 200" className="sc-svg">
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0" stopColor="var(--rc)" stopOpacity={0.55} />
              <stop offset="0.55" stopColor="var(--rc)" stopOpacity={0.18} />
              <stop offset="1" stopColor="var(--rc)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle r={99} className="sc-stone" />
          <circle r={96} fill={`url(#${glowId})`} className="sc-glow" />
          <circle r={93} className="sc-line thick" />
          <circle r={88} className="sc-line thin" />
          <g className="sc-band">
            {CREATURE_TYPES.map((type, i) => {
              const a = i * 60;
              const [x, y] = polar(R_RUNES, a);
              return (
                <g key={type} className={`type-${type}`} transform={`translate(${x} ${y}) rotate(${a})`}>
                  <circle r={9} className="sc-socket" />
                  <g
                    transform="translate(-6.5 -6.5) scale(0.8125)"
                    fill="var(--type)"
                    style={{ color: 'var(--type)' }}
                  >
                    {TYPE_GLYPHS[type]}
                  </g>
                </g>
              );
            })}
            {RUNES.map((d, i) => {
              const a = 30 + i * 60;
              const [x, y] = polar(R_RUNES, a);
              return (
                <path key={i} d={d} className="sc-rune" transform={`translate(${x} ${y}) rotate(${a})`} />
              );
            })}
          </g>
          <circle r={65} className="sc-line thick" />
          <g className="sc-star">
            <path d={star(63, 0)} className="sc-line thin" />
            <path d={star(63, 60)} className="sc-line thin" />
            <circle r={31} className="sc-line thin" />
          </g>
          <circle r={14} className="sc-heart" />
        </svg>
      </div>
      <div className="sc-pillar" />
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`sc-mote m${i}`} />
      ))}
    </div>
  );
}
