import { Glow, GroundShadow, Linear, type ArtProps } from './kit';

const INK = '#140f1f';

/** Gloomwisp – a floating will-o'-wisp living inside an old lantern, carried by moth wings. */
export function Gloomwisp({ uid, view }: ArtProps) {
  const flame = `${uid}-flame`;
  const iron = `${uid}-iron`;
  const wing = `${uid}-wing`;
  const glow = `${uid}-glow`;
  const halo = `${uid}-halo`;
  const defs = (
    <defs>
      <radialGradient id={flame} cx="50%" cy="60%" r="60%">
        <stop offset="0%" stopColor="#fff2ff" />
        <stop offset="40%" stopColor="#e2a6ff" />
        <stop offset="100%" stopColor="#8a3fd6" />
      </radialGradient>
      <Linear id={iron} from="#4a4060" to="#1f1a2e" />
      <radialGradient id={wing} cx="30%" cy="30%" r="90%">
        <stop offset="0%" stopColor="#9b88c4" />
        <stop offset="100%" stopColor="#4c3d6e" />
      </radialGradient>
      <radialGradient id={halo} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c48bff" stopOpacity={0.55} />
        <stop offset="100%" stopColor="#c48bff" stopOpacity={0} />
      </radialGradient>
      <Glow id={glow} std={4} />
    </defs>
  );

  const wings = (big: boolean) => {
    const s = big ? 1.15 : 1;
    return (
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round" className="wings">
        <g transform={`translate(100 100) scale(${s}) translate(-100 -100)`}>
          <path
            d="M70 90 Q24 50 14 82 Q8 110 40 116 Q22 136 44 146 Q62 140 72 118 Z"
            fill={`url(#${wing})`}
          />
          <path
            d="M130 90 Q176 50 186 82 Q192 110 160 116 Q178 136 156 146 Q138 140 128 118 Z"
            fill={`url(#${wing})`}
          />
          {/* eye spots */}
          <circle cx="38" cy="90" r="9" fill="#f2c94c" stroke="none" />
          <circle cx="38" cy="90" r="4.5" fill="#2a1d3a" stroke="none" />
          <circle cx="162" cy="90" r="9" fill="#f2c94c" stroke="none" />
          <circle cx="162" cy="90" r="4.5" fill="#2a1d3a" stroke="none" />
        </g>
      </g>
    );
  };

  const lantern = (face: boolean) => (
    <g>
      {/* hanging ring */}
      <circle cx="100" cy="40" r="10" fill="none" stroke={`url(#${iron})`} strokeWidth={5} />
      <path d="M78 56 L122 56 L114 46 L86 46 Z" fill={`url(#${iron})`} stroke={INK} strokeWidth={3} />
      {/* glass with the flame spirit */}
      <path d="M74 58 L126 58 L132 132 L68 132 Z" fill="#2a1d3a" stroke={INK} strokeWidth={3} />
      <ellipse cx="100" cy="98" rx="40" ry="44" fill={`url(#${halo})`} />
      <path
        d="M100 66 Q122 92 118 112 Q114 128 100 128 Q86 128 82 112 Q78 92 100 66 Z"
        fill={`url(#${flame})`}
        filter={`url(#${glow})`}
      />
      {face && (
        <g>
          {/* droopy, sorrowful eyes: outer corners sag, inner brows lift */}
          <path d="M86 104 Q92 100 97 106 Q92 112 86 104 Z" fill="#2a0f3f" />
          <path d="M114 104 Q108 100 103 106 Q108 112 114 104 Z" fill="#2a0f3f" />
          <path d="M85 99 L95 96" stroke="#2a0f3f" strokeWidth={2} strokeLinecap="round" />
          <path d="M115 99 L105 96" stroke="#2a0f3f" strokeWidth={2} strokeLinecap="round" />
          {/* small frown */}
          <path
            d="M95 120 Q100 116 105 120"
            stroke="#2a0f3f"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
          {/* a single tear */}
          <path d="M89 111 Q92 117 89 121 Q86 117 89 111 Z" fill="#bfe9ff" stroke="#2a0f3f" strokeWidth={1} />
        </g>
      )}
      {/* frame bars */}
      <g stroke={`url(#${iron})`} strokeWidth={5}>
        <path d="M74 58 L68 132" />
        <path d="M126 58 L132 132" />
        <path d="M100 58 L100 70" />
      </g>
      <path d="M62 132 L138 132 L132 146 L68 146 Z" fill={`url(#${iron})`} stroke={INK} strokeWidth={3} />
      <path d="M84 146 L116 146 L106 160 L94 160 Z" fill={`url(#${iron})`} stroke={INK} strokeWidth={3} />
      {/* glass shine */}
      <path d="M80 64 L76 120" stroke="#ffffff" strokeWidth={3} opacity={0.25} strokeLinecap="round" />
    </g>
  );

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      {/* floating: smaller, fainter shadow */}
      <GroundShadow rx={34} y={186} />
      {view === 'back' ? (
        <>
          {lantern(false)}
          {wings(true)}
        </>
      ) : (
        <>
          {wings(false)}
          {lantern(true)}
        </>
      )}
    </svg>
  );
}
