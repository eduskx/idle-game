import { Eye, Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#16233a';

/** Puddlefin – a round otter with a lily-pad hat, hugging its favorite shiny pebble. */
export function Puddlefin({ uid, view }: ArtProps) {
  const fur = `${uid}-fur`;
  const pad = `${uid}-pad`;
  const gem = `${uid}-gem`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <Shade id={fur} light="#a9c3da" base="#5f82a3" dark="#2f4a66" />
      <Shade id={pad} light="#9ee08e" base="#4fae5c" dark="#2b7240" />
      <radialGradient id={gem} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#ffe6b0" />
        <stop offset="100%" stopColor="#e0953a" />
      </radialGradient>
      <Glow id={glow} std={2.5} />
    </defs>
  );

  const hat = (
    <g>
      <path
        d="M58 52 Q62 28 100 26 Q140 28 144 50 Q134 62 100 62 Q66 62 58 52 Z"
        fill={`url(#${pad})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <path d="M100 28 L108 50" stroke="#2b7240" strokeWidth={3} />
      <path d="M78 34 Q90 44 100 44" stroke="#2b7240" strokeWidth={2} fill="none" opacity={0.6} />
      {/* flower */}
      <g transform="translate(76 32)">
        <ellipse cx="0" cy="-6" rx="5" ry="8" fill="#ffb3d1" stroke={INK} strokeWidth={2} />
        <ellipse cx="-7" cy="0" rx="8" ry="5" fill="#ffb3d1" stroke={INK} strokeWidth={2} />
        <ellipse cx="7" cy="0" rx="8" ry="5" fill="#ffb3d1" stroke={INK} strokeWidth={2} />
        <circle cx="0" cy="0" r="4" fill="#ffe066" />
      </g>
    </g>
  );

  const tail = (
    <path
      d="M64 160 Q30 170 24 142 Q40 150 58 142 Z"
      fill="#3f5f7e"
      stroke={INK}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
  );

  if (view === 'back') {
    // Seen from behind: the thick ringed otter tail sweeps toward the viewer, the darker
    // back stripe and wet fur tufts give the slender body texture, the elbows hug the
    // pebble (its glow spills out at the sides) and the whiskers poke out past the cheeks.
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={48} />
        {/* pebble glow leaking past the body */}
        <ellipse cx="100" cy="128" rx="42" ry="16" fill="#ffd98a" opacity={0.35} filter={`url(#${glow})`} />
        <ellipse cx="80" cy="178" rx="13" ry="8" fill="#2f4a66" stroke={INK} strokeWidth={3} />
        <ellipse cx="120" cy="178" rx="13" ry="8" fill="#2f4a66" stroke={INK} strokeWidth={3} />
        <path
          d="M68 150 Q62 92 100 80 Q138 92 132 150 Q130 182 100 182 Q70 182 68 150 Z"
          fill={`url(#${fur})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        {/* darker dorsal stripe and wet fur tufts */}
        <path
          d="M100 86 Q114 110 110 150 Q106 172 100 176 Q94 172 90 150 Q86 110 100 86 Z"
          fill="#2f4a66"
          opacity={0.55}
        />
        <g fill="none" stroke="#a9c3da" strokeWidth={2.2} strokeLinecap="round" opacity={0.7}>
          <path d="M78 112 l5 -5 l3 6" />
          <path d="M118 120 l5 -5 l3 6" />
          <path d="M80 146 l5 -5 l3 6" />
        </g>
        {/* elbows bent forward, hugging the pebble */}
        <path
          d="M68 118 Q56 128 66 140 Q72 134 74 124 Z"
          fill="#4c6d8d"
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path
          d="M132 118 Q144 128 134 140 Q128 134 126 124 Z"
          fill="#4c6d8d"
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* ears with darker backs */}
        <circle cx="72" cy="56" r="8" fill="#4c6d8d" stroke={INK} strokeWidth={3} />
        <circle cx="128" cy="56" r="8" fill="#4c6d8d" stroke={INK} strokeWidth={3} />
        <ellipse cx="100" cy="72" rx="34" ry="32" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
        {/* whiskers poking out past the cheeks */}
        <g stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
          <path d="M68 88 L56 84" />
          <path d="M68 92 L56 94" />
          <path d="M132 88 L144 84" />
          <path d="M132 92 L144 94" />
        </g>
        {/* nape tuft */}
        <path d="M90 100 Q100 92 110 100 Q104 98 100 104 Q96 98 90 100 Z" fill="#2f4a66" opacity={0.6} />
        <g transform="translate(200 0) scale(-1 1)">{hat}</g>
        {/* thick ringed tail swinging toward the viewer */}
        <path
          d="M104 170 Q150 176 160 150 Q166 130 150 120 Q156 140 140 154 Q124 164 102 160 Z"
          fill="#3f5f7e"
          stroke={INK}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <g stroke="#2a4460" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d="M122 160 Q126 170 124 172" />
          <path d="M140 154 Q146 162 146 168" />
          <path d="M152 140 Q158 146 160 150" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={48} />
      {tail}
      <ellipse cx="82" cy="178" rx="13" ry="8" fill="#2f4a66" stroke={INK} strokeWidth={3} />
      <ellipse cx="118" cy="178" rx="13" ry="8" fill="#2f4a66" stroke={INK} strokeWidth={3} />
      {/* body */}
      <path
        d="M70 150 Q64 96 100 84 Q136 96 130 150 Q128 182 100 182 Q72 182 70 150 Z"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <path d="M82 150 Q82 112 100 106 Q118 112 118 150 Q117 174 100 176 Q83 174 82 150 Z" fill="#e3edf3" />
      {/* ears */}
      <circle cx="72" cy="58" r="8" fill="#5f82a3" stroke={INK} strokeWidth={3} />
      <circle cx="128" cy="58" r="8" fill="#5f82a3" stroke={INK} strokeWidth={3} />
      {/* head */}
      <ellipse cx="100" cy="76" rx="34" ry="32" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
      <ellipse cx="100" cy="90" rx="20" ry="14" fill="#e3edf3" />
      {/* wide, wondering eyes fixed on the pebble below */}
      <Eye cx={86} cy={74} r={9.5} lookY={3.5} iris="#14253c" />
      <Eye cx={114} cy={74} r={9.5} lookY={3.5} iris="#14253c" />
      <path d="M78 60 Q86 56 94 60" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M106 60 Q114 56 122 60" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <ellipse cx="100" cy="87" rx="5.5" ry="4" fill="#0f1a2a" />
      {/* little "o" of fascination */}
      <ellipse cx="100" cy="97" rx="3.6" ry="4.4" fill="#3a1f2a" stroke={INK} strokeWidth={1.6} />
      {/* whiskers */}
      <g stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
        <path d="M82 90 L64 86" />
        <path d="M82 94 L64 96" />
        <path d="M118 90 L136 86" />
        <path d="M118 94 L136 96" />
      </g>
      {hat}
      {/* its favorite shiny pebble, hugged close */}
      <ellipse
        className="cr-pebble"
        cx="100"
        cy="128"
        rx="13"
        ry="11"
        fill={`url(#${gem})`}
        stroke="#8a5208"
        strokeWidth={2.5}
        filter={`url(#${glow})`}
      />
      <path d="M82 126 Q89 118 96 126 Q91 135 84 133 Z" fill="#5f82a3" stroke={INK} strokeWidth={2.5} />
      <path d="M118 126 Q111 118 104 126 Q109 135 116 133 Z" fill="#5f82a3" stroke={INK} strokeWidth={2.5} />
    </svg>
  );
}
