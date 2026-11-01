import { Blush, Eye, Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#2f1d14';

/** Puddlefin – a round otter with a lily-pad hat, hugging its favorite shiny pebble. */
export function Puddlefin({ uid, view }: ArtProps) {
  const fur = `${uid}-fur`;
  const pad = `${uid}-pad`;
  const gem = `${uid}-gem`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <Shade id={fur} light="#c48a62" base="#8e5a3a" dark="#5a3420" />
      <Shade id={pad} light="#9ee08e" base="#4fae5c" dark="#2b7240" />
      <radialGradient id={gem} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#8fe3ff" />
        <stop offset="100%" stopColor="#2f86c9" />
      </radialGradient>
      <Glow id={glow} std={2.5} />
    </defs>
  );

  const hat = (
    <g>
      <path
        d="M52 64 Q56 40 100 38 Q146 40 150 62 Q138 74 100 74 Q62 74 52 64 Z"
        fill={`url(#${pad})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <path d="M100 40 L108 62" stroke="#2b7240" strokeWidth={3} />
      <path d="M76 46 Q90 56 100 56" stroke="#2b7240" strokeWidth={2} fill="none" opacity={0.6} />
      {/* flower */}
      <g transform="translate(72 44)">
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
      fill="#6b4029"
      stroke={INK}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
  );

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={48} />
        <ellipse cx="80" cy="178" rx="13" ry="8" fill="#5a3420" stroke={INK} strokeWidth={3} />
        <ellipse cx="120" cy="178" rx="13" ry="8" fill="#5a3420" stroke={INK} strokeWidth={3} />
        <path
          d="M58 150 Q54 92 100 82 Q146 92 142 150 Q138 182 100 182 Q62 182 58 150 Z"
          fill={`url(#${fur})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        <circle cx="64" cy="70" r="9" fill="#8e5a3a" stroke={INK} strokeWidth={3} />
        <circle cx="136" cy="70" r="9" fill="#8e5a3a" stroke={INK} strokeWidth={3} />
        <ellipse cx="100" cy="82" rx="42" ry="34" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
        {hat}
        <g transform="translate(200 18) scale(-1 1)">{tail}</g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={48} />
      {tail}
      <ellipse cx="82" cy="178" rx="13" ry="8" fill="#5a3420" stroke={INK} strokeWidth={3} />
      <ellipse cx="118" cy="178" rx="13" ry="8" fill="#5a3420" stroke={INK} strokeWidth={3} />
      {/* body */}
      <path
        d="M60 150 Q56 96 100 88 Q144 96 140 150 Q136 182 100 182 Q64 182 60 150 Z"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <path d="M76 150 Q76 112 100 108 Q124 112 124 150 Q122 174 100 176 Q78 174 76 150 Z" fill="#f0d6b2" />
      {/* ears */}
      <circle cx="64" cy="74" r="9" fill="#8e5a3a" stroke={INK} strokeWidth={3} />
      <circle cx="136" cy="74" r="9" fill="#8e5a3a" stroke={INK} strokeWidth={3} />
      {/* head */}
      <ellipse cx="100" cy="88" rx="42" ry="34" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
      <ellipse cx="100" cy="102" rx="24" ry="16" fill="#f0d6b2" />
      <Eye cx={82} cy={86} r={8} />
      <Eye cx={118} cy={86} r={8} />
      <Blush cx={70} cy={100} rx={6} />
      <Blush cx={130} cy={100} rx={6} />
      <ellipse cx="100" cy="98" rx="7" ry="5" fill="#2a1a12" />
      <path d="M93 106 Q100 111 107 106" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      {/* whiskers */}
      <g stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
        <path d="M76 100 L58 96" />
        <path d="M76 104 L58 106" />
        <path d="M124 100 L142 96" />
        <path d="M124 104 L142 106" />
      </g>
      {hat}
      {/* pebble hugged by paws */}
      <ellipse
        cx="100"
        cy="140"
        rx="15"
        ry="12"
        fill={`url(#${gem})`}
        stroke="#1d4e78"
        strokeWidth={2.5}
        filter={`url(#${glow})`}
      />
      <path d="M80 136 Q88 128 96 136 Q90 146 82 144 Z" fill="#8e5a3a" stroke={INK} strokeWidth={2.5} />
      <path d="M120 136 Q112 128 104 136 Q110 146 118 144 Z" fill="#8e5a3a" stroke={INK} strokeWidth={2.5} />
    </svg>
  );
}
