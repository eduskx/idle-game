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
        <GroundShadow rx={62} />
        {/* same low mound as the front view */}
        <g transform="translate(100 182) scale(1.1 0.8) translate(-100 -182)">
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
        </g>
        {mushroom(131, 80, 1)}
        {mushroom(67, 89, 0.62)}
      </svg>
    );
  }

  // Front: a low, wide mound. The moss grows down over the face like a fringe, so the
  // shy little eyes only peek out from underneath it.
  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={62} />
      <g transform="translate(100 182) scale(1.12 0.8) translate(-100 -182)">
        <path d={mantle} fill={`url(#${moss})`} stroke={INK} strokeWidth={3.5} />
      </g>
      {/* feet */}
      <ellipse cx="70" cy="177" rx="14" ry="8" fill="#8a5130" stroke={INK} strokeWidth={3} />
      <ellipse cx="130" cy="177" rx="14" ry="8" fill="#8a5130" stroke={INK} strokeWidth={3} />
      {/* body: wide, low dome */}
      <ellipse cx="100" cy="148" rx="64" ry="34" fill={`url(#${body})`} stroke={INK} strokeWidth={3.5} />
      {/* face patch */}
      <path
        d="M66 150 Q66 122 100 120 Q134 122 134 150 Q130 176 100 177 Q70 176 66 150 Z"
        fill="#f7e4c6"
        stroke={INK}
        strokeWidth={2.5}
      />
      {/* paws held up nervously in front of the chest */}
      <path d="M78 170 Q72 160 80 156 Q88 158 88 168" fill="#c4834f" stroke={INK} strokeWidth={2.5} />
      <path d="M122 170 Q128 160 120 156 Q112 158 112 168" fill="#c4834f" stroke={INK} strokeWidth={2.5} />
      {/* eyes: small, glancing sideways */}
      <Eye cx={87} cy={141} r={7} look={-2.5} lookY={1} pupil={0.75} />
      <Eye cx={113} cy={141} r={7} look={-2.5} lookY={1} pupil={0.75} />
      {/* moss fringe hanging over the brow */}
      <path
        d="M58 140 Q62 112 100 108 Q138 112 142 140 Q134 132 126 136 Q120 128 110 134 Q100 126 90 134 Q80 128 74 136 Q66 132 58 140 Z"
        fill={`url(#${moss})`}
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* worried brows: inner ends raised */}
      <path d="M80 131 L92 128" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M120 131 L108 128" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <Blush cx={74} cy={156} rx={6} />
      <Blush cx={126} cy={156} rx={6} />
      {/* nose + tiny wobbly mouth */}
      <ellipse cx="100" cy="153" rx="4.5" ry="3.5" fill="#3d2619" />
      <path
        d="M95 162 Q97.5 160 100 162 Q102.5 164 105 162"
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* nervous sweat drop */}
      <path d="M146 120 Q150 128 146 132 Q142 128 146 120 Z" fill="#bfe6ff" stroke={INK} strokeWidth={1.5} />
      {mushroom(134, 84, 0.95)}
      <path d="M74 86 Q68 72 80 68 Q82 80 74 86 Z" fill="#8ed65f" stroke={INK} strokeWidth={2} />
    </svg>
  );
}
