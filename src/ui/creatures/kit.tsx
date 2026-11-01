import type { ReactNode } from 'react';

/**
 * Shared building blocks for the hand-drawn creature art.
 *
 * Conventions (see docs/ART_GUIDE.md):
 * - viewBox 0 0 200 200, feet/ground contact around y = 182, centered on x = 100
 * - cel style: dark tinted outline, radial "light from top-left" body gradient,
 *   a soft core shadow, specular highlights in the eyes
 * - every creature has a `front` (enemy / portraits) and a `back` view (own monster in battle)
 */
export type View = 'front' | 'back';

export interface ArtProps {
  /** Unique prefix for gradient/filter ids (several sprites share one document). */
  uid: string;
  view: View;
}

export type CreatureArt = (props: ArtProps) => ReactNode;

/** Radial body shading: light top-left, base, dark rim bottom-right. */
export function Shade({ id, light, base, dark }: { id: string; light: string; base: string; dark: string }) {
  return (
    <radialGradient id={id} cx="38%" cy="30%" r="78%">
      <stop offset="0%" stopColor={light} />
      <stop offset="55%" stopColor={base} />
      <stop offset="100%" stopColor={dark} />
    </radialGradient>
  );
}

export function Linear({
  id,
  from,
  to,
  vertical = true,
}: {
  id: string;
  from: string;
  to: string;
  vertical?: boolean;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  );
}

export function Glow({ id, std = 3 }: { id: string; std?: number }) {
  return (
    <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation={std} result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/** Ground contact shadow. */
export function GroundShadow({ rx = 46, y = 184 }: { rx?: number; y?: number }) {
  return <ellipse cx="100" cy={y} rx={rx} ry={rx * 0.16} fill="#000" opacity={0.22} />;
}

/** Big glossy cartoon eye. `look` shifts the pupil horizontally. */
export function Eye({
  cx,
  cy,
  r = 9,
  iris = '#2a1d16',
  look = 0,
  sclera = '#fff',
}: {
  cx: number;
  cy: number;
  r?: number;
  iris?: string;
  look?: number;
  sclera?: string;
}) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.12} fill={sclera} />
      <ellipse cx={cx + look} cy={cy + r * 0.12} rx={r * 0.68} ry={r * 0.8} fill={iris} />
      <circle cx={cx + look - r * 0.25} cy={cy - r * 0.3} r={r * 0.28} fill="#fff" />
      <circle cx={cx + look + r * 0.25} cy={cy + r * 0.35} r={r * 0.12} fill="#fff" opacity={0.8} />
    </g>
  );
}

/** Rosy cheek. */
export function Blush({ cx, cy, rx = 7 }: { cx: number; cy: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.55} fill="#ff7f9c" opacity={0.45} />;
}
