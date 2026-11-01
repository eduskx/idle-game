import { Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#0d0f1a';

/** Bonecrow – a crow wearing a bird skull as a mask, with thorny vine tail feathers. */
export function Bonecrow({ uid, view }: ArtProps) {
  const feather = `${uid}-feather`;
  const bone = `${uid}-bone`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <Shade id={feather} light="#5a6690" base="#2a2f48" dark="#12141f" />
      <Shade id={bone} light="#ffffff" base="#efe6d2" dark="#b8aa8c" />
      <Glow id={glow} std={2.5} />
    </defs>
  );

  const thornTail = (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
      <path d="M100 150 Q76 176 58 192 Q74 170 88 150 Z" fill="#2f5e33" />
      <path d="M100 150 Q100 180 100 196 Q108 176 106 150 Z" fill="#3e6b3a" />
      <path d="M100 150 Q124 176 142 192 Q126 170 112 150 Z" fill="#2f5e33" />
      <g fill="#8fd16a" stroke="none">
        <path d="M70 178 L64 172 L72 174 Z" />
        <path d="M130 178 L136 172 L128 174 Z" />
        <path d="M100 182 L95 176 L103 178 Z" />
      </g>
    </g>
  );

  const legs = (
    <g stroke="#c9a46a" strokeWidth={4} strokeLinecap="round" fill="none">
      <path d="M88 160 L84 182 M84 182 L76 186 M84 182 L88 188" />
      <path d="M112 160 L116 182 M116 182 L124 186 M116 182 L112 188" />
    </g>
  );

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={42} y={190} />
        {thornTail}
        {legs}
        <ellipse cx="100" cy="120" rx="46" ry="48" fill={`url(#${feather})`} stroke={INK} strokeWidth={3.5} />
        {/* folded wings with feather tips */}
        <path
          d="M56 104 Q46 140 66 166 Q74 150 70 132 Q84 150 86 166 Q92 132 82 100 Z"
          fill="#1c2033"
          stroke={INK}
          strokeWidth={3}
        />
        <path
          d="M144 104 Q154 140 134 166 Q126 150 130 132 Q116 150 114 166 Q108 132 118 100 Z"
          fill="#1c2033"
          stroke={INK}
          strokeWidth={3}
        />
        <circle cx="100" cy="66" r="32" fill={`url(#${feather})`} stroke={INK} strokeWidth={3.5} />
        {/* skull strap */}
        <path d="M70 70 Q100 80 130 70" stroke="#efe6d2" strokeWidth={6} fill="none" />
        <path d="M86 38 Q92 26 98 36 Q104 22 112 36" stroke={INK} strokeWidth={3} fill="#2a2f48" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={42} y={190} />
      {thornTail}
      {legs}
      {/* body */}
      <ellipse cx="100" cy="122" rx="44" ry="46" fill={`url(#${feather})`} stroke={INK} strokeWidth={3.5} />
      <path d="M78 120 Q100 108 122 120 Q118 150 100 156 Q82 150 78 120 Z" fill="#3b4566" opacity={0.7} />
      {/* wings */}
      <path d="M58 104 Q40 132 52 158 Q66 146 68 124 Z" fill="#1c2033" stroke={INK} strokeWidth={3} />
      <path d="M142 104 Q160 132 148 158 Q134 146 132 124 Z" fill="#1c2033" stroke={INK} strokeWidth={3} />
      {/* head, cocked to one side with a smug tilt */}
      <g transform="rotate(-14 100 80)">
        <circle cx="100" cy="68" r="32" fill={`url(#${feather})`} stroke={INK} strokeWidth={3.5} />
        <path d="M84 38 Q90 24 98 36 Q104 20 114 36" stroke={INK} strokeWidth={3} fill="#2a2f48" />
        {/* skull mask with beak */}
        <path
          d="M72 66 Q72 44 100 44 Q128 44 128 66 Q128 80 116 84 L108 108 L100 118 L92 108 L84 84 Q72 80 72 66 Z"
          fill={`url(#${bone})`}
          stroke={INK}
          strokeWidth={3}
        />
        <path d="M94 92 L100 112 L106 92" fill="none" stroke="#b8aa8c" strokeWidth={2} />
        {/* narrow, slanted sockets with slit-like glowing eyes */}
        <path d="M78 62 L98 68 Q94 74 82 70 Z" fill="#14101a" />
        <path d="M122 62 L102 68 Q106 74 118 70 Z" fill="#14101a" />
        <path
          d="M84 66 L95 68.5"
          stroke="#7dff9a"
          strokeWidth={3}
          strokeLinecap="round"
          filter={`url(#${glow})`}
        />
        <path
          d="M116 66 L105 68.5"
          stroke="#7dff9a"
          strokeWidth={3}
          strokeLinecap="round"
          filter={`url(#${glow})`}
        />
        <path d="M96 82 L100 86 L104 82" stroke="#b8aa8c" strokeWidth={2} fill="none" />
        {/* crack */}
        <path d="M108 46 L104 54 L110 58" stroke="#8e8068" strokeWidth={1.8} fill="none" />
      </g>
    </svg>
  );
}
