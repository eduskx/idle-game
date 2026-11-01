import { Glow, GroundShadow, Linear, Shade, type ArtProps } from './kit';

const INK = '#101a1e';

/** Drowned Knight – a hermit crab that made a sunken knight's great helm its shell. */
export function Drownedknight({ uid, view }: ArtProps) {
  const metal = `${uid}-metal`;
  const shell = `${uid}-shell`;
  const glow = `${uid}-glow`;
  const plume = `${uid}-plume`;
  const defs = (
    <defs>
      <Shade id={metal} light="#9fd0c6" base="#4f8580" dark="#1f3f3e" />
      <Shade id={shell} light="#ff8a6e" base="#c9473a" dark="#7e2219" />
      <Linear id={plume} from="#7a2a3a" to="#3a1420" />
      <Glow id={glow} std={3} />
    </defs>
  );

  const legs = (
    <g stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none">
      <path d="M62 160 Q44 166 38 182" stroke="#c9473a" strokeWidth={8} />
      <path d="M70 166 Q58 174 56 186" stroke="#c9473a" strokeWidth={7} />
      <path d="M138 160 Q156 166 162 182" stroke="#c9473a" strokeWidth={8} />
      <path d="M130 166 Q142 174 144 186" stroke="#c9473a" strokeWidth={7} />
    </g>
  );

  const barnacles = (
    <g fill="#d8d2c0" stroke={INK} strokeWidth={1.5}>
      <circle cx="62" cy="80" r="5" />
      <circle cx="70" cy="70" r="3.5" />
      <circle cx="140" cy="120" r="4.5" />
      <circle cx="132" cy="130" r="3" />
    </g>
  );

  const seaweed = (
    <g fill="#2f6e4f" stroke={INK} strokeWidth={2}>
      <path d="M120 44 Q126 64 118 80 Q114 66 116 52 Z" />
      <path d="M76 140 Q70 156 78 166 Q82 152 82 142 Z" />
    </g>
  );

  if (view === 'back') {
    // From behind: a raised comb ridge with rivets, a dented and rusted neck guard,
    // a barnacle colony, both claws (big one mirrored to the right) peeking out at the
    // sides, and the soft red crab abdomen curling out of the helm's rim.
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={62} />
        {legs}
        {/* claws peeking out from behind the helm */}
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path
            d="M170 150 Q186 126 170 110 Q156 102 148 116 Q160 118 160 130 Q152 128 144 134 Q150 154 170 150 Z"
            fill={`url(#${shell})`}
          />
          <path
            d="M48 140 Q30 132 28 146 Q34 148 36 152 Q30 154 32 160 Q46 162 50 152 Z"
            fill={`url(#${shell})`}
          />
        </g>
        <path
          d="M52 160 L52 82 Q52 36 100 34 Q148 36 148 82 L148 160 Q100 172 52 160 Z"
          fill={`url(#${metal})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        {/* raised comb ridge with rivets */}
        <path
          d="M94 36 Q100 32 106 36 L106 160 Q100 162 94 160 Z"
          fill="#3a6662"
          stroke={INK}
          strokeWidth={2.5}
        />
        <g fill="#9fd0c6" stroke={INK} strokeWidth={1.5}>
          <circle cx="100" cy="56" r="2.6" />
          <circle cx="100" cy="80" r="2.6" />
          <circle cx="100" cy="104" r="2.6" />
          <circle cx="100" cy="128" r="2.6" />
        </g>
        {/* neck guard plate, dented, with rust runs */}
        <path
          d="M54 126 Q100 140 146 126 L146 142 Q100 156 54 142 Z"
          fill="#3f7570"
          stroke={INK}
          strokeWidth={2.5}
        />
        <path d="M120 132 Q126 138 132 131" fill="none" stroke={INK} strokeWidth={2} opacity={0.6} />
        <g stroke="#b5622a" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.75}>
          <path d="M70 140 Q68 150 72 158" />
          <path d="M130 140 Q132 148 129 154" />
          <path d="M84 60 Q80 76 84 92" />
        </g>
        {/* patina */}
        <path
          d="M136 64 Q140 90 136 114"
          stroke="#4fa39a"
          strokeWidth={5}
          fill="none"
          opacity={0.55}
          strokeLinecap="round"
        />
        <path
          d="M100 34 Q86 10 64 14 Q78 20 76 30 Q60 26 52 40 Q74 36 100 40 Z"
          fill={`url(#${plume})`}
          stroke={INK}
          strokeWidth={2.5}
        />
        {/* barnacle colony */}
        <g fill="#d8d2c0" stroke={INK} strokeWidth={1.5}>
          <circle cx="66" cy="96" r="6" />
          <circle cx="76" cy="104" r="4" />
          <circle cx="64" cy="110" r="3.5" />
          <circle cx="134" cy="72" r="4" />
        </g>
        <g fill="#5a5448">
          <circle cx="66" cy="96" r="2" />
          <circle cx="76" cy="104" r="1.4" />
        </g>
        {seaweed}
        {/* the crab's soft abdomen curling out under the rim */}
        <path
          d="M72 164 Q100 176 128 164 Q132 178 116 184 Q100 188 92 178 Q82 182 72 164 Z"
          fill={`url(#${shell})`}
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <g stroke="#7e2219" strokeWidth={2} fill="none" strokeLinecap="round">
          <path d="M90 168 Q94 174 92 178" />
          <path d="M104 170 Q108 176 106 182" />
          <path d="M118 168 Q120 174 118 178" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={62} />
      {legs}
      {/* the helm-shell */}
      <path
        d="M52 160 L52 82 Q52 36 100 34 Q148 36 148 82 L148 160 Q100 172 52 160 Z"
        fill={`url(#${metal})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* patina streaks */}
      <path
        d="M60 60 Q64 90 58 120"
        stroke="#4fa39a"
        strokeWidth={5}
        fill="none"
        opacity={0.55}
        strokeLinecap="round"
      />
      <path
        d="M140 70 Q136 96 142 118"
        stroke="#4fa39a"
        strokeWidth={4}
        fill="none"
        opacity={0.5}
        strokeLinecap="round"
      />
      {/* two narrow visor slits: no eyes, no mouth, just a faint glow from inside */}
      <rect x="58" y="80" width="36" height="7" rx="2" fill="#061012" stroke={INK} strokeWidth={2.5} />
      <rect x="106" y="80" width="36" height="7" rx="2" fill="#061012" stroke={INK} strokeWidth={2.5} />
      <path
        d="M66 83.5 L86 83.5"
        stroke="#ffd98a"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.95}
        filter={`url(#${glow})`}
      />
      <path
        d="M114 83.5 L134 83.5"
        stroke="#ffd98a"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.95}
        filter={`url(#${glow})`}
      />
      {/* rust bleeding from the slits */}
      <path
        d="M70 88 Q68 100 72 110"
        stroke="#b5622a"
        strokeWidth={3.5}
        fill="none"
        opacity={0.75}
        strokeLinecap="round"
      />
      <path
        d="M128 88 Q131 98 127 104"
        stroke="#b5622a"
        strokeWidth={3}
        fill="none"
        opacity={0.7}
        strokeLinecap="round"
      />
      <path d="M100 90 L100 150" stroke="#3a4a50" strokeWidth={4} />
      {/* breathing holes */}
      <g fill="#0a1215">
        <circle cx="80" cy="118" r="3" />
        <circle cx="80" cy="130" r="3" />
        <circle cx="120" cy="118" r="3" />
        <circle cx="120" cy="130" r="3" />
      </g>
      {barnacles}
      {seaweed}
      {/* claws: one big, one small */}
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path
          d="M30 150 Q14 126 30 110 Q44 102 52 116 Q40 118 40 130 Q48 128 56 134 Q50 154 30 150 Z"
          fill={`url(#${shell})`}
        />
        <path
          d="M152 140 Q170 132 172 146 Q166 148 164 152 Q170 154 168 160 Q154 162 150 152 Z"
          fill={`url(#${shell})`}
        />
      </g>
      <ellipse cx="34" cy="122" rx="4" ry="2" fill="#ffd0c4" opacity={0.7} />
    </svg>
  );
}
