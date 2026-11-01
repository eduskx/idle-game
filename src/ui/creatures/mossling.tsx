import { Blush, Eye, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#3d2619';

/** Mossling – a round hedgehog whose spines are a mossy cushion with a little mushroom. */
export function Mossling({ uid, view }: ArtProps) {
  const body = `${uid}-body`;
  const moss = `${uid}-moss`;
  const cap = `${uid}-cap`;
  const defs = (
    <defs>
      <Shade id={body} light="#e6b07e" base="#c4834f" dark="#8a5130" />
      <Shade id={moss} light="#b6ec84" base="#6dbb45" dark="#357a2a" />
      <Shade id={cap} light="#ff9a7a" base="#e0503a" dark="#a12a22" />
    </defs>
  );

  const mushroom = (x: number, y: number, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0 Q-7 12 -4 16 L4 16 Q7 12 6 0 Z" fill="#f6ead2" stroke={INK} strokeWidth={2.5} />
      <path
        d="M-20 2 Q-18 -18 0 -20 Q18 -18 20 2 Q0 8 -20 2 Z"
        fill={`url(#${cap})`}
        stroke={INK}
        strokeWidth={3}
      />
      <circle cx={-8} cy={-8} r={3.2} fill="#fff4e6" />
      <circle cx={6} cy={-12} r={2.4} fill="#fff4e6" />
      <circle cx={10} cy={-3} r={2} fill="#fff4e6" />
    </g>
  );

  // Scalloped moss mantle: a ring of soft bumps.
  const mantle =
    'M40 128 Q28 112 40 98 Q34 78 54 70 Q58 50 80 50 Q92 36 112 44 Q132 36 142 54 Q164 58 164 80 Q178 94 166 112 Q174 126 160 136 Q130 118 100 118 Q70 118 40 128 Z';

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={56} />
        <ellipse cx="70" cy="176" rx="14" ry="9" fill="#8a5130" stroke={INK} strokeWidth={3} />
        <ellipse cx="130" cy="176" rx="14" ry="9" fill="#8a5130" stroke={INK} strokeWidth={3} />
        <ellipse cx="100" cy="132" rx="62" ry="48" fill={`url(#${body})`} stroke={INK} strokeWidth={3.5} />
        {/* the moss covers almost the whole back */}
        <path
          d="M38 150 Q24 128 36 110 Q30 86 52 76 Q56 52 80 52 Q94 36 114 44 Q136 36 146 58 Q170 64 168 88 Q182 104 168 124 Q176 142 160 154 Q130 166 100 166 Q66 166 38 150 Z"
          fill={`url(#${moss})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        <g fill="#a6e07a" opacity={0.75}>
          <circle cx="70" cy="80" r="6" />
          <circle cx="112" cy="64" r="5" />
          <circle cx="140" cy="100" r="6" />
          <circle cx="84" cy="122" r="5" />
          <circle cx="124" cy="140" r="4" />
        </g>
        <g fill="#2f6b24" opacity={0.5}>
          <circle cx="96" cy="96" r="4" />
          <circle cx="60" cy="128" r="4" />
          <circle cx="150" cy="128" r="3" />
        </g>
        <ellipse cx="100" cy="170" rx="8" ry="6" fill="#c4834f" stroke={INK} strokeWidth={2.5} />
        {mushroom(128, 54, 1.05)}
        {mushroom(70, 66, 0.65)}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={54} />
      <path d={mantle} fill={`url(#${moss})`} stroke={INK} strokeWidth={3.5} />
      <g fill="#a6e07a" opacity={0.8}>
        <circle cx="60" cy="84" r="5" />
        <circle cx="86" cy="60" r="4" />
        <circle cx="146" cy="76" r="5" />
      </g>
      {/* feet */}
      <ellipse cx="74" cy="176" rx="14" ry="9" fill="#8a5130" stroke={INK} strokeWidth={3} />
      <ellipse cx="126" cy="176" rx="14" ry="9" fill="#8a5130" stroke={INK} strokeWidth={3} />
      {/* body */}
      <ellipse cx="100" cy="138" rx="56" ry="44" fill={`url(#${body})`} stroke={INK} strokeWidth={3.5} />
      {/* face patch */}
      <path
        d="M62 140 Q60 106 100 102 Q140 106 138 140 Q134 172 100 174 Q66 172 62 140 Z"
        fill="#f7e4c6"
        stroke={INK}
        strokeWidth={2.5}
      />
      {/* little arms */}
      <path d="M52 146 Q44 156 54 162 Q62 160 62 150" fill="#c4834f" stroke={INK} strokeWidth={3} />
      <path d="M148 146 Q156 156 146 162 Q138 160 138 150" fill="#c4834f" stroke={INK} strokeWidth={3} />
      <Eye cx={84} cy={132} r={9} />
      <Eye cx={116} cy={132} r={9} />
      <Blush cx={72} cy={150} />
      <Blush cx={128} cy={150} />
      {/* nose + smile */}
      <ellipse cx="100" cy="146" rx="6" ry="4.5" fill="#3d2619" />
      <ellipse cx="98" cy="144.5" rx="2" ry="1.2" fill="#fff" opacity={0.7} />
      <path d="M93 154 Q100 160 107 154" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      {mushroom(132, 56, 1)}
      <path d="M78 52 Q72 38 84 34 Q86 46 78 52 Z" fill="#8ed65f" stroke={INK} strokeWidth={2} />
    </svg>
  );
}
