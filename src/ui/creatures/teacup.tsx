import { Blush, Glow, GroundShadow, Linear, type ArtProps } from './kit';

const INK = '#3a2a2a';

/** Teacup – a sleepy steam spirit that lives in a porcelain cup. Its steam curls are its ears. */
export function Teacup({ uid, view }: ArtProps) {
  const cup = `${uid}-cup`;
  const tea = `${uid}-tea`;
  const steam = `${uid}-steam`;
  const glow = `${uid}-glow`;
  const defs = (
    <defs>
      <linearGradient id={cup} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#eef0f6" />
        <stop offset="100%" stopColor="#c3c8da" />
      </linearGradient>
      <radialGradient id={tea} cx="40%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#fff2d6" />
        <stop offset="55%" stopColor="#f3c27e" />
        <stop offset="100%" stopColor="#c7864a" />
      </radialGradient>
      <Linear id={steam} from="#ffffff" to="#ffffff00" />
      <Glow id={glow} std={3} />
    </defs>
  );

  const handleSide = view === 'back' ? -1 : 1;
  const saucerAndCup = (
    <g>
      <ellipse cx="100" cy="178" rx="62" ry="12" fill="#e9ecf4" stroke={INK} strokeWidth={3} />
      <ellipse cx="100" cy="176" rx="40" ry="6" fill="#d6dbe8" />
      {/* handle */}
      <path
        d={`M${100 + handleSide * 44} 130 Q${100 + handleSide * 70} 132 ${100 + handleSide * 66} 150 Q${100 + handleSide * 60} 166 ${100 + handleSide * 40} 160`}
        fill="none"
        stroke={INK}
        strokeWidth={13}
        strokeLinecap="round"
      />
      <path
        d={`M${100 + handleSide * 44} 130 Q${100 + handleSide * 70} 132 ${100 + handleSide * 66} 150 Q${100 + handleSide * 60} 166 ${100 + handleSide * 40} 160`}
        fill="none"
        stroke="#f4f5fa"
        strokeWidth={7}
        strokeLinecap="round"
      />
      {/* cup body */}
      <path
        d="M50 118 L150 118 Q148 168 100 172 Q52 168 50 118 Z"
        fill={`url(#${cup})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* blue pattern band */}
      <path d="M54 134 Q100 146 146 134" fill="none" stroke="#cf8a34" strokeWidth={4} />
      <g fill="#cf8a34">
        <circle cx="70" cy="150" r="3.5" />
        <circle cx="100" cy="156" r="4" />
        <circle cx="130" cy="150" r="3.5" />
      </g>
      <ellipse cx="100" cy="118" rx="50" ry="10" fill="#f9fafc" stroke={INK} strokeWidth={3} />
    </g>
  );

  const spirit = (face: boolean) => (
    <g className="cr-spirit">
      {/* steam ears */}
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={0.95}
        filter={`url(#${glow})`}
        className="cr-steam"
      >
        <path d="M76 66 Q62 50 74 36 Q84 26 78 14" />
        <path d="M124 66 Q138 50 126 36 Q116 26 122 14" />
      </g>
      <path
        d="M58 118 Q54 64 100 60 Q146 64 142 118 Z"
        fill={`url(#${tea})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <ellipse cx="100" cy="118" rx="44" ry="8" fill="#b97a3f" opacity={0.6} />
      {face ? (
        <g>
          {/* heavy, half-closed eyelids */}
          <path d="M76 92 Q84 100 92 92 Z" fill="#3a2418" />
          <path d="M108 92 Q116 100 124 92 Z" fill="#3a2418" />
          <path d="M74 92 L94 92" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M106 92 L126 92" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <Blush cx={72} cy={104} rx={6} />
          <Blush cx={128} cy={104} rx={6} />
          {/* big yawn */}
          <ellipse cx="100" cy="107" rx="6" ry="7.5" fill="#5a2a22" stroke={INK} strokeWidth={2.2} />
          <ellipse cx="100" cy="111" rx="3.6" ry="2.4" fill="#e9877e" />
          {/* drowsy "z" */}
          <g className="cr-zz">
            <path
              d="M138 64 L148 64 L138 74 L148 74"
              fill="none"
              stroke="#8a6a5a"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M150 50 L156 50 L150 56 L156 56"
              fill="none"
              stroke="#8a6a5a"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          {/* floating leaf */}
          <path d="M108 70 Q122 62 128 72 Q118 80 108 70 Z" fill="#7cc46a" stroke={INK} strokeWidth={2} />
        </g>
      ) : (
        <g>
          {/* back of the head: a slow tea swirl, the leaf from the other side, still dozing */}
          <path
            d="M100 96 Q92 96 92 88 Q92 78 102 78 Q114 78 114 90 Q114 104 98 106 Q80 106 78 90"
            stroke="#fff2d6"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.75}
          />
          <path d="M92 70 Q78 62 72 72 Q82 80 92 70 Z" fill="#7cc46a" stroke={INK} strokeWidth={2} />
          <path d="M92 70 Q82 70 76 72" stroke="#4f8f44" strokeWidth={1.5} fill="none" />
          <g className="cr-zz">
            <path
              d="M52 64 L62 64 L52 74 L62 74"
              fill="none"
              stroke="#8a6a5a"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={60} y={188} />
      {spirit(view === 'front')}
      {saucerAndCup}
      {view === 'back' && (
        <g>
          {/* chipped rim (the cup's little flaw) */}
          <path
            d="M118 110 L124 116 L130 110 Z"
            fill="#c7864a"
            stroke={INK}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* tea bag string over the rim with its tag */}
          <path d="M78 116 Q72 128 74 140" stroke={INK} strokeWidth={1.8} fill="none" />
          <rect x="66" y="140" width="16" height="14" rx="2" fill="#f6e3b4" stroke={INK} strokeWidth={2.2} />
          <path d="M70 147 H78" stroke="#cf8a34" strokeWidth={2} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
