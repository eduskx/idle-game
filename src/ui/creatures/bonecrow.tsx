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
    // Seen from behind, but the head stays cocked like the front, so the beak tip, the
    // mask rim and one glowing slit peek out on the right: it is watching the enemy.
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={42} y={190} />
        {thornTail}
        {legs}
        <ellipse cx="100" cy="120" rx="46" ry="48" fill={`url(#${feather})`} stroke={INK} strokeWidth={3.5} />
        {/* layered back feathers */}
        <g fill="none" stroke="#12141f" strokeWidth={2.5} strokeLinecap="round" opacity={0.8}>
          <path d="M84 104 Q92 112 100 104 Q108 112 116 104" />
          <path d="M80 124 Q90 134 100 124 Q110 134 120 124" />
        </g>
        {/* folded wings, spiky feather tips crossing over the tail */}
        <path
          d="M58 100 Q44 134 62 172 L70 158 L74 170 L80 154 L88 164 Q92 130 84 98 Z"
          fill="#1c2033"
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path
          d="M142 100 Q156 134 138 172 L130 158 L126 170 L120 154 L112 164 Q108 130 116 98 Z"
          fill="#1c2033"
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <g className="cr-head">
          <g transform="rotate(-14 100 80)">
            {/* beak tip and mask rim visible past the cheek */}
            <path
              d="M118 72 Q134 70 132 84 L114 116 L112 100 Z"
              fill={`url(#${bone})`}
              stroke={INK}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx="100" cy="68" r="32" fill={`url(#${feather})`} stroke={INK} strokeWidth={3.5} />
            <path
              d="M120 60 L132 64"
              stroke="#7dff9a"
              strokeWidth={3}
              strokeLinecap="round"
              filter={`url(#${glow})`}
            />
            {/* mask strap tied at the back of the head */}
            <path d="M68 72 Q100 84 132 70" stroke="#efe6d2" strokeWidth={6} fill="none" />
            <path d="M68 72 Q100 84 132 70" stroke="#b8aa8c" strokeWidth={1.5} fill="none" />
            <path
              d="M96 78 L86 96 L94 94 M104 78 L110 98 L102 94"
              stroke="#efe6d2"
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="78" r="4.5" fill="#efe6d2" stroke={INK} strokeWidth={2} />
            <path d="M84 38 Q90 24 98 36 Q104 20 114 36" stroke={INK} strokeWidth={3} fill="#2a2f48" />
          </g>
        </g>
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
      <g className="cr-head">
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
      </g>
    </svg>
  );
}
