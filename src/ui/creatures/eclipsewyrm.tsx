import { Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#070a1c';

/** Eclipse Wyrm – an abyssal sea serpent, coiled, with an eclipse ring burning behind its head. */
export function Eclipsewyrm({ uid, view }: ArtProps) {
  const scale = `${uid}-scale`;
  const fin = `${uid}-fin`;
  const corona = `${uid}-corona`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <Shade id={scale} light="#4a5ca8" base="#232c63" dark="#0d1233" />
      <Shade id={fin} light="#a88cff" base="#6a4cc9" dark="#3b2580" />
      <radialGradient id={corona} cx="50%" cy="50%" r="50%">
        <stop offset="62%" stopColor="#0b0b18" />
        <stop offset="70%" stopColor="#ffd27a" />
        <stop offset="82%" stopColor="#ff8a3c" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#ff8a3c" stopOpacity={0} />
      </radialGradient>
      <Glow id={glow} std={3} />
    </defs>
  );

  const ring = <circle cx="104" cy="58" r="42" fill={`url(#${corona})`} />;

  // Coiled lower body: two stacked loops.
  const coils = (
    <g stroke={INK} strokeWidth={3.5}>
      <ellipse cx="100" cy="166" rx="62" ry="20" fill={`url(#${scale})`} />
      <path
        d="M46 162 Q100 186 154 162"
        stroke="#4be3d0"
        strokeWidth={4}
        fill="none"
        filter={`url(#${glow})`}
      />
      <ellipse cx="96" cy="142" rx="48" ry="18" fill={`url(#${scale})`} />
      <path
        d="M54 140 Q96 160 138 140"
        stroke="#4be3d0"
        strokeWidth={4}
        fill="none"
        filter={`url(#${glow})`}
      />
      {/* tail fin */}
      <path d="M156 160 Q186 150 190 128 Q176 140 160 144 Z" fill={`url(#${fin})`} />
    </g>
  );

  const crest = (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" fill={`url(#${fin})`}>
      <path d="M118 92 L138 80 L132 100 Z" />
      <path d="M120 110 L144 104 L132 120 Z" />
      <path d="M116 126 L138 128 L124 138 Z" />
    </g>
  );

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={66} y={186} />
        {ring}
        {coils}
        {/* neck rising, seen from behind */}
        <path
          d="M84 146 Q70 100 92 70 Q104 54 118 62 Q124 90 112 112 Q104 130 112 146 Z"
          fill={`url(#${scale})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round" fill={`url(#${fin})`}>
          <path d="M100 70 L96 46 L112 64 Z" />
          <path d="M98 92 L84 74 L104 82 Z" />
          <path d="M98 116 L82 102 L104 108 Z" />
        </g>
        <ellipse cx="104" cy="56" rx="24" ry="18" fill={`url(#${scale})`} stroke={INK} strokeWidth={3.5} />
        <path d="M86 46 Q80 26 92 18 Q90 34 96 42 Z" fill="#c9b8ff" stroke={INK} strokeWidth={2.5} />
        <path d="M120 46 Q128 26 118 16 Q118 32 112 42 Z" fill="#c9b8ff" stroke={INK} strokeWidth={2.5} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={66} y={186} />
      {ring}
      {coils}
      {/* neck */}
      <path
        d="M78 146 Q66 104 88 74 Q100 58 116 64 Q124 92 110 114 Q100 130 108 146 Z"
        fill={`url(#${scale})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <path
        d="M86 140 Q80 108 96 82"
        stroke="#4be3d0"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        filter={`url(#${glow})`}
      />
      {crest}
      {/* head */}
      <path
        d="M70 62 Q74 34 104 34 Q132 36 134 58 Q134 72 120 80 L96 84 Q72 82 70 62 Z"
        fill={`url(#${scale})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* horns */}
      <path d="M84 40 Q76 18 88 10 Q88 26 94 36 Z" fill="#c9b8ff" stroke={INK} strokeWidth={2.5} />
      <path d="M120 40 Q130 18 120 8 Q118 24 112 34 Z" fill="#c9b8ff" stroke={INK} strokeWidth={2.5} />
      {/* glowing eyes */}
      <path d="M82 56 Q90 50 96 56 Q90 60 82 56 Z" fill="#4be3d0" filter={`url(#${glow})`} />
      <path d="M110 56 Q118 50 124 56 Q118 60 110 56 Z" fill="#4be3d0" filter={`url(#${glow})`} />
      {/* snout + fangs */}
      <path d="M92 76 L96 84 L100 76 M104 76 L108 84 L112 76" fill="#f4f0ff" stroke={INK} strokeWidth={1.5} />
      <circle cx="96" cy="68" r="1.8" fill={INK} />
      <circle cx="110" cy="68" r="1.8" fill={INK} />
      {/* whisker-barbels */}
      <path d="M74 70 Q56 74 50 90" stroke="#4be3d0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M130 70 Q148 72 154 88" stroke="#4be3d0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </svg>
  );
}
