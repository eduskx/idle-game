import { Glow, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#0b0812';

/** Hexcat – a sitting black cat with three emerald-flame tails and a golden rune collar. */
export function Hexcat({ uid, view }: ArtProps) {
  const fur = `${uid}-fur`;
  const flame = `${uid}-flame`;
  const glow = `${uid}-glow`;
  const backFur = `${uid}-bfur`;
  const defs = (
    <defs>
      <Shade id={fur} light="#4b4068" base="#251f36" dark="#100c18" />
      <radialGradient id={flame} cx="50%" cy="65%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#b9ffd9" />
        <stop offset="100%" stopColor="#14c873" />
      </radialGradient>
      <Glow id={glow} std={3.5} />
    </defs>
  );

  const flameTip = (x: number, y: number, r = 0) => (
    <path
      transform={`translate(${x} ${y}) rotate(${r})`}
      d="M0 8 Q-12 -2 -4 -14 Q-2 -6 2 -8 Q0 -20 8 -26 Q8 -12 12 -6 Q14 4 0 8 Z"
      fill={`url(#${flame})`}
      filter={`url(#${glow})`}
    />
  );

  // Three tails fanning out behind the body.
  const tails = (
    <g stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round">
      <path
        className="cr-tail cr-tail-1"
        d="M120 164 Q166 160 160 112 Q156 90 140 80"
        stroke={`url(#${fur})`}
        strokeWidth={12}
      />
      <path
        className="cr-tail cr-tail-2"
        d="M118 166 Q182 168 180 128 Q178 110 170 100"
        stroke={`url(#${fur})`}
        strokeWidth={11}
      />
      <path
        className="cr-tail cr-tail-3"
        d="M82 166 Q30 166 30 124 Q30 104 42 92"
        stroke={`url(#${fur})`}
        strokeWidth={11}
      />
    </g>
  );
  const tailFlames = (
    <g>
      <g className="cr-tail cr-tail-1">{flameTip(140, 78, -20)}</g>
      <g className="cr-tail cr-tail-2">{flameTip(170, 98, 10)}</g>
      <g className="cr-tail cr-tail-3">{flameTip(42, 90, -10)}</g>
    </g>
  );

  const ears = (
    <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
      <path d="M60 64 L56 18 L92 46 Z" fill={`url(#${fur})`} />
      <path d="M140 64 L144 18 L108 46 Z" fill={`url(#${fur})`} />
      <path d="M64 54 L62 30 L82 46 Z" fill="#1f9e64" stroke="none" />
      <path d="M136 54 L138 30 L118 46 Z" fill="#1f9e64" stroke="none" />
    </g>
  );

  const collar = (
    <g>
      <path d="M66 112 Q100 128 134 112" stroke="#d4a73a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M66 112 Q100 128 134 112" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.5} />
    </g>
  );

  if (view === 'back') {
    // Seen from behind the cat is mostly black fur, so it reads through light instead of color:
    // an emerald rim light thrown by the tail flames, emerald ear insides peeking past the ear
    // backs, the gold collar with its buckle and three outlined tails curling out to the sides.
    const BODY = 'M60 176 Q50 120 76 104 Q100 94 124 104 Q150 120 140 176 Z';
    const HEAD = 'M58 74 A42 36 0 1 0 142 74 A42 36 0 1 0 58 74 Z';
    const rim = `${uid}-rim`;
    const rimLit = (d: string, cx: number, cy: number) => (
      <g>
        <path d={d} fill="#2fd98a" />
        {/* the copy covers all but a crescent: thick on the right (two flames), thin on the left */}
        <path
          d={d}
          fill={`url(#${backFur})`}
          transform={`translate(${cx - 3.5} ${cy + 3}) scale(0.94 0.97) translate(${-cx} ${-cy})`}
        />
        <path d={d} fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
    );
    const backTails = (
      <g strokeLinecap="round" fill="none">
        {(
          [
            ['cr-tail cr-tail-3', 'M84 170 Q34 172 30 126 Q30 104 42 92', 11],
            ['cr-tail cr-tail-1', 'M114 170 Q166 164 160 112 Q156 90 140 80', 12],
            ['cr-tail cr-tail-2', 'M118 172 Q184 172 180 128 Q178 110 170 100', 11],
          ] as const
        ).map(([cls, d, w]) => (
          <g key={cls} className={cls}>
            <path d={d} stroke={INK} strokeWidth={w + 7} />
            <path d={d} stroke={`url(#${backFur})`} strokeWidth={w} />
            <path d={d} stroke="#2fd98a" strokeWidth={2} opacity={0.6} transform="translate(2 -2)" />
          </g>
        ))}
      </g>
    );
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <defs>
          <Shade id={backFur} light="#5d4f85" base="#2c2542" dark="#130f1e" />
          <clipPath id={rim}>
            <path d={BODY} />
          </clipPath>
        </defs>
        <GroundShadow rx={56} />
        {rimLit(BODY, 100, 140)}
        {/* haunches and a faint hex sigil in the fur between the shoulders */}
        <g clipPath={`url(#${rim})`}>
          <ellipse cx="70" cy="166" rx="20" ry="16" fill="#3a3157" stroke={INK} strokeWidth={2.5} />
          <ellipse cx="130" cy="166" rx="20" ry="16" fill="#3a3157" stroke={INK} strokeWidth={2.5} />
        </g>
        <path
          d="M100 128 L100 150 M92 132 L108 146 M108 132 L92 146"
          stroke="#2fd98a"
          strokeWidth={2.2}
          strokeLinecap="round"
          opacity={0.55}
        />
        {/* ears: dark backs with the emerald insides showing along the outer edges */}
        <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
          <path d="M60 64 L56 18 L92 46 Z" fill={`url(#${backFur})`} />
          <path d="M140 64 L144 18 L108 46 Z" fill={`url(#${backFur})`} />
        </g>
        <path d="M58.5 52 L56.5 22 L66 36 Q62 44 58.5 52 Z" fill="#1fbf78" />
        <path d="M141.5 52 L143.5 22 L134 36 Q138 44 141.5 52 Z" fill="#1fbf78" />
        <path d="M60 40 L57 22 L74 34" stroke="#7dffb6" strokeWidth={1.6} fill="none" opacity={0.7} />
        <path d="M140 40 L143 22 L126 34" stroke="#7dffb6" strokeWidth={1.6} fill="none" opacity={0.7} />
        {rimLit(HEAD, 100, 74)}
        {/* nape tuft and the parting of the fur on the crown */}
        <path d="M88 104 L94 96 L100 106 L106 96 L112 104" fill="none" stroke={INK} strokeWidth={2.5} />
        <path d="M84 56 Q100 50 116 56" stroke="#6a5c94" strokeWidth={3} fill="none" opacity={0.7} />
        {/* collar from behind: the band dips over the nape, buckle in the middle */}
        <path
          d="M62 106 Q100 124 138 106"
          stroke="#d4a73a"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
        <path d="M62 106 Q100 124 138 106" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.5} />
        <rect x="90" y="108" width="20" height="14" rx="2.5" fill="#f0c95a" stroke={INK} strokeWidth={2.5} />
        <rect x="95" y="112" width="10" height="6" rx="1" fill="#6b4e12" />
        <path d="M100 112 L100 118" stroke="#f0c95a" strokeWidth={2} />
        <path d="M110 114 L118 113" stroke="#a37a1e" strokeWidth={3} strokeLinecap="round" />
        {/* the three tails curl out to both sides, each ending in a flame */}
        {backTails}
        {tailFlames}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={52} />
      {tails}
      {tailFlames}
      {/* sitting body */}
      <path
        d="M62 176 Q52 124 78 106 Q100 96 122 106 Q148 124 138 176 Z"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* front paws */}
      <ellipse cx="86" cy="176" rx="12" ry="8" fill="#251f36" stroke={INK} strokeWidth={3} />
      <ellipse cx="114" cy="176" rx="12" ry="8" fill="#251f36" stroke={INK} strokeWidth={3} />
      {ears}
      <ellipse cx="100" cy="76" rx="44" ry="38" fill={`url(#${fur})`} stroke={INK} strokeWidth={3.5} />
      {/* half-lidded, disdainful eyes: heavy flat lids, slit pupils glancing aside */}
      <g>
        <path d="M70 76 Q82 66 94 76 Q82 86 70 76 Z" fill="#7dffb6" />
        <path d="M106 76 Q118 66 130 76 Q118 86 106 76 Z" fill="#7dffb6" />
        <ellipse cx="86" cy="78" rx="2" ry="5" fill={INK} />
        <ellipse cx="122" cy="78" rx="2" ry="5" fill={INK} />
        <path
          d="M68 74 L96 72 L94 77 Q82 74 70 77 Z"
          fill="#251f36"
          stroke={INK}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d="M132 74 L104 72 L106 77 Q118 74 130 77 Z"
          fill="#251f36"
          stroke={INK}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </g>
      {/* nose held high */}
      <path d="M96 90 L104 90 L100 94 Z" fill="#8a6a7a" />
      {/* one-sided smirk */}
      <path d="M98 99 Q104 102 111 96" stroke="#8a7aa8" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <g stroke="#6a5a8a" strokeWidth={1.5} opacity={0.8}>
        <path d="M70 90 L52 84" />
        <path d="M70 94 L52 94" />
        <path d="M130 90 L148 84" />
        <path d="M130 94 L148 94" />
      </g>
      {collar}
      {/* rune charm */}
      <circle cx="100" cy="126" r="8" fill="#d4a73a" stroke={INK} strokeWidth={2.5} />
      <path d="M96 122 L104 130 M104 122 L96 130 M100 120 L100 132" stroke="#0f6a40" strokeWidth={1.8} />
    </svg>
  );
}
