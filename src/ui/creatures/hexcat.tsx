import { Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#0b0812';

/** Hexcat – a sitting black cat with three violet-flame tails and a golden rune collar. */
export function Hexcat({ uid, view }: ArtProps) {
  const fur = `${uid}-fur`;
  const flame = `${uid}-flame`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <Shade id={fur} light="#4b4068" base="#251f36" dark="#100c18" />
      <radialGradient id={flame} cx="50%" cy="65%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#f0c8ff" />
        <stop offset="100%" stopColor="#9b4dff" />
      </radialGradient>
      <Glow id={glow} std={3.5} />
    </defs>
  );

  const flameTip = (x: number, y: number, r = 0) => (
    <path
      transform={`translate(${x} ${y}) rotate(${r})`}
      d="M0 8 Q-12 -2 -4 -14 Q-2 -6 2 -8 Q0 -20 8 -26 Q8 -12 12 -6 Q14 4 0 8 Z"
      fill={`url(#${flame})`}
      filter={`url(#${glow})`}
    />
  );

  // Three tails fanning out behind the body.
  const tails = (
    <g stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round">
      <path d="M120 164 Q166 160 160 112 Q156 90 140 80" stroke={`url(#${fur})`} strokeWidth={12} />
      <path d="M118 166 Q182 168 180 128 Q178 110 170 100" stroke={`url(#${fur})`} strokeWidth={11} />
      <path d="M82 166 Q30 166 30 124 Q30 104 42 92" stroke={`url(#${fur})`} strokeWidth={11} />
    </g>
  );
  const tailFlames = (
    <g>
      {flameTip(140, 78, -20)}
      {flameTip(170, 98, 10)}
      {flameTip(42, 90, -10)}
    </g>
  );

  const ears = (
    <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
      <path d="M60 64 L56 18 L92 46 Z" fill={`url(#${fur})`} />
      <path d="M140 64 L144 18 L108 46 Z" fill={`url(#${fur})`} />
      <path d="M64 54 L62 30 L82 46 Z" fill="#8a4fd6" stroke="none" />
      <path d="M136 54 L138 30 L118 46 Z" fill="#8a4fd6" stroke="none" />
    </g>
  );

  const collar = (
    <g>
      <path d="M66 112 Q100 128 134 112" stroke="#d4a73a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M66 112 Q100 128 134 112" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.5} />
    </g>
  );

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={52} />
        <path
          d="M60 176 Q50 120 76 104 Q100 94 124 104 Q150 120 140 176 Z"
          fill={`url(#${fur})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        {ears}
        <ellipse cx="100" cy="74" rx="42" ry="36" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
        {collar}
        {/* tails rise in front, seen from behind */}
        <g transform="translate(0 6)">
          {tails}
          {tailFlames}
        </g>
        <path d="M84 60 Q100 54 116 60" stroke="#4b4068" strokeWidth={3} fill="none" opacity={0.6} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={52} />
      {tails}
      {tailFlames}
      {/* sitting body */}
      <path
        d="M62 176 Q52 124 78 106 Q100 96 122 106 Q148 124 138 176 Z"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* front paws */}
      <ellipse cx="86" cy="176" rx="12" ry="8" fill="#251f36" stroke={INK} strokeWidth={3} />
      <ellipse cx="114" cy="176" rx="12" ry="8" fill="#251f36" stroke={INK} strokeWidth={3} />
      {ears}
      <ellipse cx="100" cy="76" rx="44" ry="38" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
      {/* big yellow eyes with slit pupils */}
      <g>
        <ellipse cx="82" cy="78" rx="12" ry="13" fill="#ffd34d" />
        <ellipse cx="118" cy="78" rx="12" ry="13" fill="#ffd34d" />
        <ellipse cx="82" cy="78" rx="3.2" ry="10" fill={INK} />
        <ellipse cx="118" cy="78" rx="3.2" ry="10" fill={INK} />
        <circle cx="78" cy="72" r="3" fill="#fff" />
        <circle cx="114" cy="72" r="3" fill="#fff" />
      </g>
      <path d="M96 94 L104 94 L100 99 Z" fill="#c77dff" />
      <path
        d="M92 102 Q96 106 100 102 Q104 106 108 102"
        stroke="#6a5a8a"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <g stroke="#6a5a8a" strokeWidth={1.5} opacity={0.8}>
        <path d="M70 94 L52 90" />
        <path d="M70 98 L52 100" />
        <path d="M130 94 L148 90" />
        <path d="M130 98 L148 100" />
      </g>
      {collar}
      {/* rune charm */}
      <circle cx="100" cy="126" r="8" fill="#d4a73a" stroke={INK} strokeWidth={2.5} />
      <path d="M96 122 L104 130 M104 122 L96 130 M100 120 L100 132" stroke="#5a2d8a" strokeWidth={1.8} />
    </svg>
  );
}
