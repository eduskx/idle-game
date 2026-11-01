import { Blush, GroundShadow, Shade, type ArtProps } from './kit';

const INK = '#3a2210';

function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(' L')} Z`;
}

/** Honeybear – a chunky cub in honeycomb armor, guarded by two loyal bees. */
export function Honeybear({ uid, view }: ArtProps) {
  const fur = `${uid}-fur`;
  const comb = `${uid}-comb`;
  const defs = (
    <defs>
      <Shade id={fur} light="#ffd98a" base="#e6a63a" dark="#a5641a" />
      <Shade id={comb} light="#ffbe4a" base="#d4780f" dark="#8f4508" />
    </defs>
  );

  const bee = (x: number, y: number, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="bee">
      <g className="cr-bee">
        <ellipse cx="-4" cy="-8" rx="6" ry="8" fill="#ffffffcc" stroke={INK} strokeWidth={1.5} />
        <ellipse cx="4" cy="-8" rx="6" ry="8" fill="#ffffffcc" stroke={INK} strokeWidth={1.5} />
        <ellipse cx="0" cy="0" rx="10" ry="7" fill="#ffcf3f" stroke={INK} strokeWidth={2} />
        <path d="M-3 -6 L-3 6 M3 -6 L3 6" stroke={INK} strokeWidth={2.5} />
        <circle cx="6" cy="-1" r="1.4" fill={INK} />
      </g>
    </g>
  );

  const ears = (
    <g stroke={INK} strokeWidth={3.5}>
      <circle cx="58" cy="54" r="16" fill={`url(#${fur})`} />
      <circle cx="142" cy="54" r="16" fill={`url(#${fur})`} />
      <circle cx="58" cy="56" r="8" fill="#fff0c8" stroke="none" />
      <circle cx="142" cy="56" r="8" fill="#fff0c8" stroke="none" />
    </g>
  );

  const combCells = (cells: [number, number][], r: number) => (
    <g>
      {cells.map(([x, y], i) => (
        <path key={i} d={hexPath(x, y, r)} fill={`url(#${comb})`} stroke="#8a5208" strokeWidth={2} />
      ))}
    </g>
  );

  if (view === 'back') {
    return (
      <svg viewBox="0 0 200 200">
        {defs}
        <GroundShadow rx={60} />
        <ellipse cx="70" cy="176" rx="18" ry="10" fill="#8a4f14" stroke={INK} strokeWidth={3} />
        <ellipse cx="130" cy="176" rx="18" ry="10" fill="#8a4f14" stroke={INK} strokeWidth={3} />
        <path
          d="M34 116 Q34 96 54 96 L146 96 Q166 96 166 116 L168 168 Q168 184 150 184 L50 184 Q32 184 32 168 Z"
          fill={`url(#${fur})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        {/* arm backs hanging at the sides, matching the front silhouette */}
        <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
          <path d="M42 108 Q22 116 20 144 Q20 162 30 170 L50 170 Q56 148 54 122 Z" fill={`url(#${fur})`} />
          <path
            d="M158 108 Q178 116 180 144 Q180 162 170 170 L150 170 Q144 148 146 122 Z"
            fill={`url(#${fur})`}
          />
        </g>
        <path
          d="M30 150 Q38 156 48 150 M152 150 Q162 156 170 150"
          stroke="#a5641a"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* honeycomb back plate */}
        <path
          d="M60 116 Q100 100 140 116 L136 158 Q100 170 64 158 Z"
          fill="#4a2a10"
          stroke={INK}
          strokeWidth={3}
        />
        {combCells(
          [
            [80, 124],
            [100, 118],
            [120, 124],
            [90, 141],
            [110, 141],
            [100, 158],
          ],
          10,
        )}
        <circle cx="100" cy="176" r="7" fill="#e6a63a" stroke={INK} strokeWidth={2.5} />
        {ears}
        <rect
          x="52"
          y="38"
          width="96"
          height="76"
          rx="30"
          fill={`url(#${fur})`}
          stroke={INK}
          strokeWidth={3.5}
        />
        {/* honey cap seen from behind: same puddle as the front, drips running down the nape */}
        <path
          d="M72 46 Q100 34 128 46 Q130 54 124 54 Q122 70 116 70 Q110 70 110 58 Q104 56 98 58 Q98 78 91 78 Q84 78 86 56 Q78 58 76 64 Q70 66 72 46 Z"
          fill="#d9790f"
          stroke="#8a5208"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path d="M84 45 Q96 40 110 42" stroke="#ffc65a" strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx="91" cy="72" r="2" fill="#ffc65a" />
        {bee(36, 92, 0.9)}
        {bee(166, 70, 0.8)}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200">
      {defs}
      <GroundShadow rx={60} />
      <ellipse cx="72" cy="178" rx="18" ry="10" fill="#8a4f14" stroke={INK} strokeWidth={3} />
      <ellipse cx="128" cy="178" rx="18" ry="10" fill="#8a4f14" stroke={INK} strokeWidth={3} />
      {/* body */}
      <path
        d="M36 120 Q36 100 56 100 L144 100 Q164 100 164 120 L166 168 Q166 184 148 184 L52 184 Q34 184 34 168 Z"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* honeycomb chest plate */}
      <path
        d="M68 118 Q100 108 132 118 L128 162 Q100 172 72 162 Z"
        fill="#4a2a10"
        stroke={INK}
        strokeWidth={3}
      />
      {combCells(
        [
          [88, 128],
          [112, 128],
          [100, 146],
          [80, 150],
          [120, 150],
        ],
        10,
      )}
      {/* arms: the left hangs at the side, the right paw rests on the belly. Both hug the block,
          so the square silhouette stays intact. */}
      <g stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
        <path d="M44 112 Q24 118 22 146 Q21 162 30 170 L52 170 Q58 150 56 126 Z" fill={`url(#${fur})`} />
        <path
          d="M156 112 Q178 120 176 146 Q174 166 150 166 Q128 166 124 154 Q126 144 140 144 Q154 140 146 124 Z"
          fill={`url(#${fur})`}
        />
      </g>
      {/* paws: pale pads and blunt claws; the right one cups the belly */}
      <ellipse cx="40" cy="166" rx="14" ry="9" fill={`url(#${fur})`} stroke={INK} strokeWidth={3} />
      <ellipse cx="40" cy="168" rx="7" ry="3.8" fill="#fff0c8" />
      <path
        d="M31 172 L30 176 M40 174 L40 178 M49 172 L50 176"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <ellipse cx="134" cy="153" rx="12" ry="10" fill={`url(#${fur})`} stroke={INK} strokeWidth={3} />
      <path
        d="M124 148 L120 147 M123 154 L119 155 M125 160 L122 162"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* shoulder pads */}
      <path d={hexPath(52, 118, 16)} fill={`url(#${comb})`} stroke={INK} strokeWidth={3} />
      <path d={hexPath(148, 118, 16)} fill={`url(#${comb})`} stroke={INK} strokeWidth={3} />
      {ears}
      {/* head */}
      <rect
        x="52"
        y="42"
        width="96"
        height="76"
        rx="30"
        fill={`url(#${fur})`}
        stroke={INK}
        strokeWidth={3.5}
      />
      <ellipse cx="100" cy="96" rx="22" ry="16" fill="#fff0c8" />
      {/* eyes closed in calm contentment */}
      <path d="M72 80 Q80 72 88 80" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M112 80 Q120 72 128 80" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <Blush cx={68} cy={94} rx={7} />
      <Blush cx={132} cy={94} rx={7} />
      <ellipse cx="100" cy="90" rx="8" ry="6" fill="#2a1608" />
      <path
        d="M88 99 Q94 106 100 100 Q106 106 112 99"
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* honey drip on the head */}
      <path
        d="M76 46 Q100 36 124 46 Q124 54 118 52 Q116 62 110 58 Q106 54 100 56 Q92 64 88 54 Q80 56 76 46 Z"
        fill="#d9790f"
        stroke="#8a5208"
        strokeWidth={2}
      />
      <ellipse cx="92" cy="45" rx="6" ry="2.5" fill="#fff3c4" opacity={0.8} />
      {bee(34, 70, 0.9)}
      {bee(168, 52, 0.8)}
    </svg>
  );
}
