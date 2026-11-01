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

  const ring = (
    <circle cx="104" cy={view === 'back' ? 58 : 52} r={view === 'back' ? 42 : 56} fill={`url(#${corona})`} />
  );

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
      {/* horns, swept back like a crown */}
      <path d="M80 40 Q68 16 82 4 Q82 22 92 32 Z" fill="#c9b8ff" stroke={INK} strokeWidth={2.5} />
      <path d="M128 40 Q140 16 126 4 Q126 22 116 32 Z" fill="#c9b8ff" stroke={INK} strokeWidth={2.5} />
      {/* lower jaw, dropped open */}
      <path
        d="M80 80 Q104 92 128 80 L122 100 Q104 112 86 100 Z"
        fill={`url(#${scale})`}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <path d="M86 82 Q104 90 122 82 L118 94 Q104 102 90 94 Z" fill="#3a0d2a" />
      <path d="M96 94 Q104 98 112 94" stroke="#a8326a" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* lower fangs */}
      <g fill="#f4f0ff" stroke={INK} strokeWidth={1.5} strokeLinejoin="round">
        <path d="M90 94 L93 84 L96 95 Z" />
        <path d="M118 94 L115 84 L112 95 Z" />
      </g>
      {/* skull: wide wedge, heavy and regal */}
      <path
        d="M64 58 Q66 30 104 28 Q142 30 144 58 Q144 70 134 78 Q120 84 104 84 Q88 84 74 78 Q64 70 64 58 Z"
        fill={`url(#${scale})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* upper fangs, long outer pair */}
      <g fill="#f4f0ff" stroke={INK} strokeWidth={1.5} strokeLinejoin="round">
        <path d="M86 80 L90 96 L94 82 Z" />
        <path d="M122 80 L118 96 L114 82 Z" />
        <path d="M98 84 L100 90 L102 84 Z" />
        <path d="M106 84 L108 90 L110 84 Z" />
      </g>
      {/* gold scale band across the brow echoes the corona */}
      <path d="M90 36 Q104 30 118 36 L112 42 L104 38 L96 42 Z" fill="#ffd27a" stroke={INK} strokeWidth={2} />
      {/* heavy brow ridges angled down to the center: a fierce glare */}
      <path d="M68 48 Q82 42 100 54 L98 60 Q84 54 70 56 Z" fill="#0d1233" stroke={INK} strokeWidth={2} />
      <path d="M140 48 Q126 42 108 54 L110 60 Q124 54 138 56 Z" fill="#0d1233" stroke={INK} strokeWidth={2} />
      {/* narrow glowing gold eyes with slit pupils */}
      <path d="M76 58 L98 62 Q90 68 80 65 Z" fill="#ffd27a" filter={`url(#${glow})`} />
      <path d="M132 58 L110 62 Q118 68 128 65 Z" fill="#ffd27a" filter={`url(#${glow})`} />
      <ellipse cx="89" cy="62.5" rx="1.3" ry="3" fill={INK} />
      <ellipse cx="119" cy="62.5" rx="1.3" ry="3" fill={INK} />
      {/* nostrils */}
      <path d="M97 72 L100 75 M111 72 L108 75" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      {/* whisker-barbels */}
      <path d="M70 72 Q52 78 46 96" stroke="#4be3d0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M138 72 Q156 76 162 94" stroke="#4be3d0" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </svg>
  );
}
