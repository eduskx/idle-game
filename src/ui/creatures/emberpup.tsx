import { Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#4a1a0e';

/** Emberpup – a red-panda kit with a big ringed tail whose tip smoulders like a coal. */
export function Emberpup({ uid, view }: ArtProps) {
  const fur = `${uid}-fur`;
  const ember = `${uid}-ember`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <Shade id={fur} light="#ff9a5c" base="#d9592a" dark="#8e2f14" />
      <radialGradient id={ember} cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#fff6c2" />
        <stop offset="45%" stopColor="#ffc64a" />
        <stop offset="100%" stopColor="#ff6a1f" />
      </radialGradient>
      <Glow id={glow} std={4} />
    </defs>
  );

  // Bushy tail with dark rings, curling up on the right.
  const tail = (flip: boolean) => (
    <g transform={flip ? 'translate(200 0) scale(-1 1)' : undefined}>
      <path
        d="M128 160 Q176 160 178 120 Q180 84 156 66 Q170 96 150 112 Q138 124 126 136 Z"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <path
        d="M150 140 Q166 132 172 116"
        stroke="#6b2410"
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
      />
      <path d="M160 102 Q170 92 166 80" stroke="#6b2410" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path
        className="cr-flame"
        d="M156 66 Q148 46 160 34 Q164 48 174 50 Q172 66 162 74 Z"
        fill={`url(#${ember})`}
        filter={`url(#${glow})`}
      />
      <circle cx="164" cy="30" r="2.5" fill="#ffd36b" filter={`url(#${glow})`} />
      <circle cx="176" cy="42" r="1.8" fill="#ffd36b" filter={`url(#${glow})`} />
    </g>
  );

  const ears = (
    <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
      <path d="M58 74 Q50 40 74 46 Q84 56 84 66 Z" fill={`url(#${fur})`} />
      <path d="M142 74 Q150 40 126 46 Q116 56 116 66 Z" fill={`url(#${fur})`} />
      <path d="M64 66 Q60 50 72 52 Q78 58 78 64 Z" fill="#fff1df" stroke="none" />
      <path d="M136 66 Q140 50 128 52 Q122 58 122 64 Z" fill="#fff1df" stroke="none" />
    </g>
  );

  // From behind: no pale insides, but the dark backs red pandas have.
  const backEars = (
    <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
      <path d="M58 74 Q50 40 74 46 Q84 56 84 66 Z" fill={`url(#${fur})`} />
      <path d="M142 74 Q150 40 126 46 Q116 56 116 66 Z" fill={`url(#${fur})`} />
      <path d="M62 68 Q58 50 72 52 Q78 58 78 64 Z" fill="#6b2410" stroke="none" />
      <path d="M138 68 Q142 50 128 52 Q122 58 122 64 Z" fill="#6b2410" stroke="none" />
    </g>
  );

  // From behind the tail is the part closest to the camera: it grows from the rump, sweeps out to
  // the left past the head and ends in the glowing coal tip. Three bold rings read even at 48 px.
  const tailClip = `${uid}-tailclip`;
  const TAIL_D = 'M112 178 Q46 192 22 142 Q8 104 28 68 Q36 52 52 62 Q38 88 44 118 Q54 156 104 156 Z';
  const backTail = (
    <g className="cr-tail-back">
      <clipPath id={tailClip}>
        <path d={TAIL_D} />
      </clipPath>
      <path d={TAIL_D} fill={`url(#${fur})`} />
      <g clipPath={`url(#${tailClip})`}>
        {/* dark rings, perpendicular to the sweep */}
        <path d="M62 146 L58 196" stroke="#5e1f0c" strokeWidth={13} />
        <path d="M0 132 L54 112" stroke="#5e1f0c" strokeWidth={13} />
        <path d="M8 84 L54 96" stroke="#5e1f0c" strokeWidth={11} />
        {/* lit outer edge */}
        <path d="M96 180 Q46 186 26 140" stroke="#ffb27a" strokeWidth={4} fill="none" opacity={0.7} />
        {/* the tip smoulders like a coal */}
        <circle cx="38" cy="62" r="17" fill={`url(#${ember})`} />
      </g>
      <path d={TAIL_D} fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <g className="cr-flame-back">
        <path
          d="M40 66 Q24 46 38 26 Q42 42 54 42 Q58 58 48 68 Z"
          fill={`url(#${ember})`}
          filter={`url(#${glow})`}
        />
      </g>
      <circle cx="30" cy="24" r="2.6" fill="#ffd36b" filter={`url(#${glow})`} />
      <circle cx="56" cy="32" r="1.9" fill="#ffd36b" filter={`url(#${glow})`} />
      <circle cx="22" cy="44" r="1.5" fill="#ffd36b" filter={`url(#${glow})`} />
    </g>
  );

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={50} />
        {/* body */}
        <ellipse cx="100" cy="150" rx="40" ry="32" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
        <ellipse cx="78" cy="178" rx="12" ry="7" fill="#3a1a12" stroke={INK} strokeWidth={3} />
        <ellipse cx="122" cy="178" rx="12" ry="7" fill="#3a1a12" stroke={INK} strokeWidth={3} />
        {/* white cheek ruffs peeking past the head, like the front's mask */}
        <path d="M60 96 Q44 104 52 120 Q62 116 70 112 Z" fill="#fff1df" stroke={INK} strokeWidth={3} />
        <path d="M140 96 Q156 104 148 120 Q138 116 130 112 Z" fill="#fff1df" stroke={INK} strokeWidth={3} />
        {backEars}
        <circle cx="100" cy="94" r="44" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
        {/* darker saddle down the nape and back */}
        <path d="M86 132 Q100 126 114 132 Q112 160 100 170 Q88 160 86 132 Z" fill="#8a2f12" opacity={0.55} />
        <path
          d="M70 116 Q100 128 130 116"
          stroke="#b5461c"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />
        {backTail}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={50} />
      <g className="cr-tail">{tail(false)}</g>
      {/* body + legs */}
      <ellipse cx="100" cy="150" rx="36" ry="30" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
      <ellipse cx="100" cy="154" rx="20" ry="18" fill="#3a1a12" opacity={0.85} />
      <ellipse cx="82" cy="178" rx="11" ry="7" fill="#3a1a12" stroke={INK} strokeWidth={3} />
      <ellipse cx="118" cy="178" rx="11" ry="7" fill="#3a1a12" stroke={INK} strokeWidth={3} />
      {ears}
      {/* head */}
      <circle cx="100" cy="96" r="44" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
      {/* white mask */}
      <path
        d="M62 104 Q66 84 86 90 Q100 96 114 90 Q134 84 138 104 Q132 130 100 132 Q68 130 62 104 Z"
        fill="#fff1df"
      />
      <path d="M70 76 Q78 70 86 76" stroke="#fff1df" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M114 76 Q122 70 130 76" stroke="#fff1df" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* tear marks */}
      <path d="M80 108 Q76 120 82 128" stroke="#a63a16" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path
        d="M120 108 Q124 120 118 128"
        stroke="#a63a16"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      {/* squinted, confident eyes: flat upper lids, one brow cocked */}
      <path d="M71 100 Q82 92 93 100 Q82 106 71 100 Z" fill="#fff" />
      <path d="M107 100 Q118 92 129 100 Q118 106 107 100 Z" fill="#fff" />
      <circle cx="85" cy="100" r="4.2" fill="#3a1408" />
      <circle cx="121" cy="100" r="4.2" fill="#3a1408" />
      <circle cx="86.5" cy="98.5" r="1.4" fill="#fff" />
      <circle cx="122.5" cy="98.5" r="1.4" fill="#fff" />
      <path d="M69 98 Q82 90 95 97" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M105 97 Q118 90 131 98" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M72 88 L92 90" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M108 86 Q118 78 130 84" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M95 110 Q100 106 105 110 Q100 116 95 110 Z" fill="#2a0e06" />
      {/* lopsided grin with a single fang */}
      <path d="M90 119 Q102 124 114 114" fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
      <path
        d="M106 120 L109 128 L112 117 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}
