import type { CSSProperties, ReactNode } from 'react';

/**
 * Per-zone backdrop: a sky layer (sun, moon, stars), a far and a mid parallax layer with the
 * zone's landmark, flat ground decor on the floor and a small pool of ambient particles.
 * Everything is static SVG; only transform/opacity are animated (CSS, gated by data-motion).
 * Silhouettes use --hill-far / --hill-near (mixed from the zone's sky), landmarks own colors.
 */

export type FxKind =
  | 'petals'
  | 'fog'
  | 'ripples'
  | 'wisps'
  | 'smoke'
  | 'embers'
  | 'bees'
  | 'bubbles'
  | 'snow'
  | 'twinkle'
  | 'fireflies'
  | 'motes';

interface Scenery {
  sky?: ReactNode;
  far: ReactNode;
  mid: ReactNode;
  ground?: ReactNode;
  fx: FxKind;
  /** Number of particles (kept small for phones). */
  count: number;
}

const FAR = 'var(--hill-far)';
const NEAR = 'var(--hill-near)';

// ------------------------------------------------------------------ shared shapes

function Cloud({ x, y, s = 1, o = 0.75 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={o}>
      <ellipse cx={0} cy={0} rx={22} ry={8} />
      <circle cx={-8} cy={-5} r={8} />
      <circle cx={6} cy={-7} r={10} />
    </g>
  );
}

function Stars({ pts, fill = '#fff' }: { pts: [number, number, number][]; fill?: string }) {
  return (
    <g fill={fill}>
      {pts.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} opacity={0.5 + (i % 3) * 0.2} />
      ))}
    </g>
  );
}

const STARFIELD: [number, number, number][] = [
  [20, 18, 1.2],
  [58, 40, 0.8],
  [96, 12, 1.4],
  [130, 52, 0.9],
  [168, 24, 1.1],
  [210, 8, 0.8],
  [236, 46, 1.3],
  [268, 20, 0.9],
  [304, 58, 1],
  [338, 14, 1.5],
  [372, 36, 0.9],
  [390, 64, 1.1],
  [44, 76, 0.8],
  [186, 70, 0.9],
];

function Moon({
  x,
  y,
  r,
  fill,
  crescent,
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
  crescent?: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.9} fill={fill} opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill={fill} />
      {crescent && <circle cx={x + r * 0.45} cy={y - r * 0.2} r={r * 0.9} fill={crescent} />}
    </g>
  );
}

/** Round deciduous tree. */
function Tree({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <rect x={-2.5} y={-14} width={5} height={14} />
      <circle cx={0} cy={-22} r={12} />
      <circle cx={-8} cy={-16} r={8} />
      <circle cx={8} cy={-16} r={8} />
    </g>
  );
}

/** Snowy pine. */
function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2} y={-6} width={4} height={6} fill="#6b4a3a" />
      <path d="M0 -44 L14 -18 L8 -18 L18 -6 L-18 -6 L-8 -18 L-14 -18 Z" fill="#3f6f6a" />
      <path
        d="M0 -44 L7 -31 L3 -29 L0 -32 L-3 -29 L-7 -31 Z M-10 -18 L-4 -20 L0 -17 L5 -20 L10 -18 L6 -24 L-6 -24 Z"
        fill="#fff"
      />
    </g>
  );
}

/** Gravestone variants. */
function Grave({
  x,
  y,
  s = 1,
  kind,
  tilt = 0,
}: {
  x: number;
  y: number;
  s?: number;
  kind: 0 | 1 | 2;
  tilt?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      {kind === 0 && (
        <>
          <path d="M-9 0 L-9 -16 Q-9 -26 0 -26 Q9 -26 9 -16 L9 0 Z" fill="#57536b" />
          <path d="M-9 0 L-9 -16 Q-9 -26 0 -26 L0 0 Z" fill="#6b6782" />
          <path d="M-4 -16 L4 -16 M0 -20 L0 -10" stroke="#3a364d" strokeWidth={1.6} />
        </>
      )}
      {kind === 1 && (
        <>
          <path
            d="M-2.5 0 L-2.5 -14 L-8 -14 L-8 -19 L-2.5 -19 L-2.5 -26 L2.5 -26 L2.5 -19 L8 -19 L8 -14 L2.5 -14 L2.5 0 Z"
            fill="#5f5b75"
          />
        </>
      )}
      {kind === 2 && (
        <>
          <rect x={-10} y={-14} width={20} height={14} rx={2} fill="#4c4860" />
          <rect x={-10} y={-14} width={10} height={14} rx={2} fill="#5d5974" />
        </>
      )}
      <path d="M-11 0 Q0 -4 11 0 Z" fill="#2c4a3a" opacity={0.8} />
    </g>
  );
}

/** Cottage with chimney (smoke is a particle layer aligned to the chimneys). */
function House({
  x,
  y,
  s = 1,
  wall,
  roof,
}: {
  x: number;
  y: number;
  s?: number;
  wall: string;
  roof: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={8} y={-40} width={6} height={14} fill="#7a4f3a" />
      <rect x={-18} y={-24} width={36} height={24} fill={wall} />
      <path d="M-22 -22 L0 -42 L22 -22 Z" fill={roof} />
      <rect x={-4} y={-13} width={8} height={13} rx={1} fill="#6b3f2a" />
      <rect x={-14} y={-18} width={7} height={7} rx={1} fill="#ffd56b" />
      <rect x={8} y={-18} width={7} height={7} rx={1} fill="#ffd56b" />
    </g>
  );
}

/** Straw skep beehive on a little stand. */
function Skep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-12} y={-6} width={3} height={6} fill="#7a5532" />
      <rect x={9} y={-6} width={3} height={6} fill="#7a5532" />
      <rect x={-15} y={-8} width={30} height={3} rx={1} fill="#8a6038" />
      <path d="M-13 -8 Q-14 -34 0 -34 Q14 -34 13 -8 Z" fill="#e2a948" />
      <g stroke="#b97a2a" strokeWidth={1.6} fill="none">
        <path d="M-13 -14 Q0 -11 13 -14" />
        <path d="M-12.5 -20 Q0 -17 12.5 -20" />
        <path d="M-10.5 -26 Q0 -23 10.5 -26" />
        <path d="M-6 -31 Q0 -29 6 -31" />
      </g>
      <ellipse cx={0} cy={-11} rx={3} ry={2.2} fill="#3a2410" />
    </g>
  );
}

function Sunflower({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 0 L0 ${-h}`} stroke="#4f8a3a" strokeWidth={2} />
      <path d={`M0 ${-h * 0.45} q6 -6 10 -2 q-5 4 -10 2`} fill="#5f9a46" />
      <circle cx={0} cy={-h} r={7} fill="#f6c43c" />
      <circle cx={0} cy={-h} r={3.4} fill="#6b4220" />
    </g>
  );
}

function DeadTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      stroke={NEAR}
      strokeLinecap="round"
      fill="none"
    >
      <path d="M0 0 Q2 -18 -2 -34 Q-4 -46 4 -58" strokeWidth={5} />
      <path d="M-1 -26 Q-12 -32 -18 -44 M-18 -44 L-24 -46 M-18 -44 L-17 -52" strokeWidth={3} />
      <path d="M0 -38 Q10 -40 16 -50 M16 -50 L22 -52 M10 -44 L12 -50" strokeWidth={2.5} />
      <path d="M3 -52 L10 -58 M4 -58 L0 -64" strokeWidth={2} />
    </g>
  );
}

function Kelp({ x, y, h, cls }: { x: number; y: number; h: number; cls: string }) {
  return (
    <g className={cls} transform={`translate(${x} ${y})`}>
      <path
        d={`M0 0 Q-7 ${-h * 0.25} 0 ${-h * 0.5} Q7 ${-h * 0.75} 0 ${-h}`}
        stroke="#1f6b5a"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx={-4}
        cy={-h * 0.3}
        rx={5}
        ry={2.4}
        fill="#2a8a6e"
        transform={`rotate(-30 -4 ${-h * 0.3})`}
      />
      <ellipse cx={4} cy={-h * 0.62} rx={5} ry={2.4} fill="#2a8a6e" transform={`rotate(30 4 ${-h * 0.62})`} />
    </g>
  );
}

function GlowShroom({ x, y, s = 1, cap }: { x: number; y: number; s?: number; cap: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-9} r={11} fill={cap} opacity={0.18} />
      <rect x={-1.6} y={-8} width={3.2} height={8} rx={1.5} fill="#e6e0ff" />
      <path d="M-7 -7 Q0 -16 7 -7 Z" fill={cap} />
      <circle cx={-2} cy={-10} r={1} fill="#fff" opacity={0.8} />
    </g>
  );
}

// ------------------------------------------------------------------ the 12 zones

const SCENERY: Record<string, Scenery> = {
  meadow: {
    sky: (
      <>
        <circle cx={330} cy={44} r={30} fill="#fff6c2" opacity={0.35} />
        <circle cx={330} cy={44} r={18} fill="#fff6c2" opacity={0.9} />
        <Cloud x={80} y={50} />
        <Cloud x={220} y={30} s={0.8} o={0.6} />
      </>
    ),
    far: (
      <>
        <path d="M0 112 Q60 70 130 100 Q190 64 260 94 Q330 66 400 96 L400 160 L0 160 Z" fill={FAR} />
        <Tree x={180} y={92} s={0.6} fill={FAR} />
        <Tree x={196} y={94} s={0.5} fill={FAR} />
      </>
    ),
    mid: (
      <>
        {/* windmill */}
        <g transform="translate(318 132)">
          <path d="M-12 0 L-7 -54 L7 -54 L12 0 Z" fill="#f4ead6" />
          <path d="M0 0 L0 -54 L7 -54 L12 0 Z" fill="#d9c9a8" />
          <path d="M-10 -54 L0 -66 L10 -54 Z" fill="#c4553e" />
          <rect x={-3} y={-14} width={6} height={14} rx={3} fill="#7a4a32" />
          <g className="scn-spin" style={{ transformOrigin: '0px -54px' }}>
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a} 0 -54)`}>
                <rect x={-1} y={-90} width={2} height={36} fill="#7a4a32" />
                <rect x={1} y={-88} width={8} height={28} fill="#fff" opacity={0.9} />
              </g>
            ))}
            <circle cx={0} cy={-54} r={3} fill="#7a4a32" />
          </g>
        </g>
        <path d="M0 140 Q80 112 170 132 Q250 148 320 124 Q370 112 400 122 L400 160 L0 160 Z" fill={NEAR} />
        {/* fence */}
        <g stroke="#f4ead6" strokeWidth={2} opacity={0.85}>
          <path d="M14 132 L90 128 M14 138 L90 134" />
          {[18, 36, 54, 72, 88].map((x) => (
            <path key={x} d={`M${x} 140 L${x} 124`} />
          ))}
        </g>
        <g>
          {[
            [110, 136, '#fff'],
            [128, 140, '#ffd84a'],
            [250, 140, '#ff9ab8'],
            [368, 128, '#ffd84a'],
            [386, 132, '#fff'],
          ].map(([x, y, c]) => (
            <circle key={`${x}`} cx={x as number} cy={y as number} r={2.4} fill={c as string} />
          ))}
        </g>
      </>
    ),
    ground: (
      <g>
        {[
          [20, 30],
          [60, 70],
          [370, 120],
          [340, 40],
          [200, 18],
          [120, 140],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx={-5} cy={0} rx={3} ry={1.6} fill={i % 2 ? '#fff' : '#ffd84a'} />
            <ellipse cx={4} cy={2} rx={3} ry={1.6} fill={i % 2 ? '#ffd84a' : '#fff'} />
            <ellipse cx={0} cy={-3} rx={3} ry={1.6} fill="#ff9ab8" />
          </g>
        ))}
      </g>
    ),
    fx: 'petals',
    count: 6,
  },

  hollow: {
    sky: (
      <>
        <Stars pts={STARFIELD.slice(0, 9)} fill="#e6d9ff" />
        <Moon x={272} y={60} r={14} fill="#d8c8ff" crescent="#2b2140" />
      </>
    ),
    far: (
      <path
        d="M0 120 L30 90 L44 104 L70 60 L84 80 L100 46 L112 70 L140 76 L160 52 L182 84 L210 66 L240 96 L262 58 L276 72 L300 34 L318 80 L350 70 L372 92 L400 76 L400 160 L0 160 Z"
        fill={FAR}
      />
    ),
    mid: (
      <>
        <path d="M0 142 Q60 118 120 132 Q200 150 260 128 Q330 110 400 130 L400 160 L0 160 Z" fill={NEAR} />
        <DeadTree x={46} y={136} s={1.1} />
        <DeadTree x={354} y={130} s={0.95} flip />
        <DeadTree x={250} y={134} s={0.55} />
        <g fill="#c8a6ff" opacity={0.85}>
          <circle cx={30} cy={98} r={1.6} />
          <circle cx={360} cy={88} r={1.6} />
        </g>
      </>
    ),
    fx: 'fog',
    count: 3,
  },

  pond: {
    sky: (
      <>
        <Cloud x={70} y={40} s={1.1} />
        <Cloud x={300} y={56} s={0.9} o={0.65} />
      </>
    ),
    far: (
      <>
        <path d="M0 118 Q50 86 110 104 Q170 80 230 100 Q300 78 400 104 L400 160 L0 160 Z" fill={FAR} />
        {[40, 58, 300, 322, 344].map((x, i) => (
          <Tree key={x} x={x} y={104 + (i % 2) * 3} s={0.7} fill={FAR} />
        ))}
      </>
    ),
    mid: (
      <>
        <path d="M0 146 Q100 132 200 138 Q300 144 400 134 L400 160 L0 160 Z" fill="#6fb8d0" />
        <path
          d="M30 144 Q120 136 210 141 M240 140 Q320 136 390 138"
          stroke="#e8f8ff"
          strokeWidth={1.4}
          opacity={0.7}
          fill="none"
        />
        {/* reeds */}
        <g stroke="#4c8a48" strokeWidth={2} strokeLinecap="round">
          <path d="M12 146 Q10 120 16 100 M22 148 Q22 118 26 106 M30 146 Q34 126 40 114" />
          <path d="M372 140 Q374 116 368 98 M382 142 Q382 118 388 104" />
        </g>
        <g fill="#8a5a3a">
          <rect x={14.5} y={98} width={4} height={13} rx={2} />
          <rect x={24.5} y={104} width={4} height={12} rx={2} />
          <rect x={366} y={96} width={4} height={13} rx={2} />
        </g>
        {/* little jetty */}
        <g transform="translate(300 138)">
          <rect x={0} y={-6} width={50} height={4} fill="#a87a50" />
          <rect x={4} y={-2} width={3} height={8} fill="#7a5532" />
          <rect x={42} y={-2} width={3} height={8} fill="#7a5532" />
        </g>
      </>
    ),
    ground: (
      <g>
        {[
          [30, 30, 18],
          [96, 12, 12],
          [370, 44, 20],
          [250, 10, 11],
          [170, 24, 9],
        ].map(([x, y, r = 12], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path
              d={`M0 0 L${r} ${-r * 0.12} A${r} ${r * 0.45} 0 1 1 ${r * 0.95} ${r * 0.14} Z`}
              fill="#4f9a52"
            />
            <ellipse cx={0} cy={0} rx={r} ry={r * 0.45} fill="none" stroke="#3a7a40" strokeWidth={1} />
            {i % 2 === 0 && <circle cx={-r * 0.3} cy={-r * 0.15} r={3.4} fill="#ffb4d0" />}
          </g>
        ))}
      </g>
    ),
    fx: 'ripples',
    count: 4,
  },

  crypt: {
    sky: (
      <>
        <Stars pts={STARFIELD.slice(4)} fill="#cfd4ff" />
        <Moon x={320} y={36} r={12} fill="#cfd4ff" />
      </>
    ),
    far: (
      <>
        <path d="M0 126 Q100 112 200 120 Q300 128 400 114 L400 160 L0 160 Z" fill={FAR} />
        {/* mausoleum */}
        <g fill={FAR}>
          <path d="M150 122 L150 86 L200 66 L250 86 L250 122 Z" />
          <rect x={192} y={46} width={16} height={24} />
          <path d="M188 46 L200 30 L212 46 Z" />
          <path d="M120 122 L120 92 L130 80 L140 92 L140 122 Z M260 122 L260 92 L270 80 L280 92 L280 122 Z" />
        </g>
        <path d="M193 122 L193 100 Q200 92 207 100 L207 122 Z" fill="#9fffb0" opacity={0.25} />
      </>
    ),
    mid: (
      <>
        <path d="M0 140 Q90 126 190 136 Q290 146 400 130 L400 160 L0 160 Z" fill={NEAR} />
        {/* iron fence */}
        <g stroke={NEAR} strokeWidth={2}>
          <path d="M0 116 L120 116 M290 112 L400 112" />
          {[6, 22, 38, 54, 70, 86, 102, 118, 294, 310, 326, 342, 358, 374, 390].map((x) => (
            <path key={x} d={`M${x} 138 L${x} 106 M${x - 2.5} 109 L${x} 104 L${x + 2.5} 109`} fill="none" />
          ))}
        </g>
        <Grave x={36} y={142} kind={0} s={1.2} tilt={-6} />
        <Grave x={78} y={140} kind={1} s={1.05} tilt={4} />
        <Grave x={140} y={138} kind={2} s={0.8} />
        <Grave x={312} y={136} kind={0} s={0.95} tilt={5} />
        <Grave x={360} y={140} kind={1} s={1.15} tilt={-8} />
      </>
    ),
    ground: (
      <g fill="#1a1726" opacity={0.55}>
        <rect x={10} y={30} width={40} height={8} rx={2} />
        <rect x={330} y={110} width={46} height={10} rx={2} />
        <rect x={170} y={10} width={30} height={6} rx={2} />
      </g>
    ),
    fx: 'wisps',
    count: 4,
  },

  hearthtown: {
    sky: (
      <>
        <circle cx={90} cy={92} r={44} fill="#ffd9a0" opacity={0.4} />
        <circle cx={90} cy={92} r={26} fill="#ffe3b0" />
        <Cloud x={260} y={40} s={1.1} o={0.7} />
      </>
    ),
    far: (
      <>
        <path d="M0 124 Q100 104 200 116 Q300 126 400 108 L400 160 L0 160 Z" fill={FAR} />
        <g fill={FAR}>
          <path d="M180 116 L180 92 L192 80 L204 92 L204 116 Z" />
          <rect x={189} y={62} width={6} height={20} />
          <path d="M186 62 L192 52 L198 62 Z" />
          <path d="M210 116 L210 100 L226 90 L242 100 L242 116 Z M150 116 L150 102 L164 92 L178 102 L178 116 Z" />
        </g>
      </>
    ),
    mid: (
      <>
        <path d="M0 140 Q100 126 200 134 Q300 142 400 128 L400 160 L0 160 Z" fill={NEAR} />
        <House x={44} y={138} s={1.15} wall="#f6e2c0" roof="#c4553e" />
        <House x={102} y={136} s={0.85} wall="#e8c99a" roof="#7a6aa8" />
        <House x={340} y={134} s={1.05} wall="#f2d6b0" roof="#5f8a52" />
        {/* lantern string */}
        <path d="M128 112 Q230 132 318 108" stroke="#7a4f3a" strokeWidth={1} fill="none" />
        {[150, 180, 210, 240, 270, 298].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={118 + Math.sin(i) * 3 + (i > 2 ? 0 : 2)}
            r={2.6}
            fill={i % 2 ? '#ffd56b' : '#ff9a6b'}
          />
        ))}
      </>
    ),
    ground: (
      <g fill="#c79f78" opacity={0.6}>
        {[
          [24, 24],
          [70, 60],
          [340, 30],
          [372, 90],
          [180, 140],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={10} ry={4} />
        ))}
      </g>
    ),
    fx: 'smoke',
    count: 6,
  },

  ashfields: {
    sky: (
      <>
        <circle cx={300} cy={120} r={90} fill="#ff6a3a" opacity={0.12} />
        <Stars pts={STARFIELD.slice(0, 5)} fill="#ffb08a" />
      </>
    ),
    far: (
      <>
        {/* volcano */}
        <path d="M150 124 L240 54 L262 54 L360 124 Z" fill={FAR} />
        <path d="M236 58 Q251 48 266 58 L262 54 L240 54 Z" fill="#ff7a3c" />
        <path
          d="M244 56 L238 78 L246 74 L242 96"
          stroke="#ff7a3c"
          strokeWidth={2}
          fill="none"
          opacity={0.8}
        />
        <g fill="#5a3a3a" opacity={0.5}>
          <circle cx={252} cy={40} r={9} />
          <circle cx={262} cy={26} r={12} />
          <circle cx={248} cy={10} r={14} />
        </g>
        <path d="M0 128 L40 112 L80 120 L120 104 L160 124 L400 124 L400 160 L0 160 Z" fill={FAR} />
      </>
    ),
    mid: (
      <>
        <path d="M0 142 Q80 128 170 138 Q260 148 330 130 Q370 122 400 132 L400 160 L0 160 Z" fill={NEAR} />
        <g fill={NEAR}>
          <path d="M40 140 L42 104 L46 100 L48 118 L54 110 L52 140 Z" />
          <path d="M340 132 L343 98 L348 96 L349 112 L356 106 L354 132 Z" />
          <path d="M110 142 L130 126 L156 132 L160 142 Z" />
        </g>
        <path d="M112 141 L128 132 L140 136" stroke="#ff7a3c" strokeWidth={1.5} fill="none" />
        <circle cx={47} cy={104} r={2} fill="#ff9a4c" />
      </>
    ),
    ground: (
      <g stroke="#ff7a3c" strokeWidth={1.6} fill="none" opacity={0.75}>
        <path d="M10 40 L30 46 L44 40 L60 50" />
        <path d="M330 100 L350 92 L366 100 L392 94" />
        <path d="M180 10 L196 16 L210 12" />
        <path d="M120 150 L136 142 L150 148" />
      </g>
    ),
    fx: 'embers',
    count: 8,
  },

  orchard: {
    sky: (
      <>
        <circle cx={70} cy={40} r={16} fill="#fff4c0" />
        <circle cx={70} cy={40} r={28} fill="#fff4c0" opacity={0.3} />
        <Cloud x={250} y={46} s={1} o={0.7} />
      </>
    ),
    far: (
      <>
        <path d="M0 120 Q100 100 200 112 Q300 124 400 104 L400 160 L0 160 Z" fill={FAR} />
        {[20, 52, 84, 116, 250, 282, 314, 346, 378].map((x, i) => (
          <Tree key={x} x={x} y={112 - (i % 2) * 2} s={0.75} fill={FAR} />
        ))}
      </>
    ),
    mid: (
      <>
        <path d="M0 140 Q100 128 200 136 Q300 144 400 130 L400 160 L0 160 Z" fill={NEAR} />
        {/* apple tree with fruit */}
        <g transform="translate(362 132)">
          <rect x={-3} y={-30} width={6} height={30} fill="#7a5532" />
          <circle cx={0} cy={-44} r={22} fill="#6fae4c" />
          <circle cx={-16} cy={-34} r={13} fill="#5f9a42" />
          <circle cx={16} cy={-34} r={13} fill="#5f9a42" />
          {[
            [-8, -50],
            [10, -42],
            [-18, -34],
            [14, -30],
            [2, -58],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3} fill="#e8574a" />
          ))}
        </g>
        <Skep x={38} y={140} s={1.15} />
        <Skep x={82} y={138} s={0.9} />
        <Sunflower x={118} y={140} h={30} />
        <Sunflower x={132} y={140} h={22} />
        <Sunflower x={318} y={134} h={26} />
      </>
    ),
    ground: (
      <g>
        {[
          [26, 30],
          [80, 70],
          [350, 46],
          [372, 120],
          [200, 14],
        ].map(([x, y], i) => (
          <g key={i} fill="#4f8a3a" opacity={0.7} transform={`translate(${x} ${y})`}>
            <ellipse cx={-3} cy={0} rx={3.4} ry={2} />
            <ellipse cx={3} cy={0} rx={3.4} ry={2} />
            <ellipse cx={0} cy={-2.4} rx={3.4} ry={2} />
          </g>
        ))}
        <circle cx={60} cy={44} r={3} fill="#e8574a" />
        <circle cx={330} cy={66} r={3} fill="#e8574a" />
      </g>
    ),
    fx: 'bees',
    count: 4,
  },

  drownedcity: {
    sky: (
      <>
        <g className="scn-rays" fill="#9fe8ff">
          <path d="M60 0 L90 0 L150 200 L110 200 Z" opacity={0.08} />
          <path d="M170 0 L190 0 L230 200 L200 200 Z" opacity={0.06} />
          <path d="M280 0 L320 0 L360 200 L310 200 Z" opacity={0.08} />
        </g>
        <path
          d="M0 6 Q25 2 50 6 T100 6 T150 6 T200 6 T250 6 T300 6 T350 6 T400 6"
          stroke="#9fe8ff"
          strokeWidth={1.4}
          fill="none"
          opacity={0.35}
        />
      </>
    ),
    far: (
      <>
        <path d="M0 128 Q100 116 200 122 Q300 128 400 118 L400 160 L0 160 Z" fill={FAR} />
        <g fill={FAR}>
          {/* broken towers and an arch */}
          <path d="M60 124 L60 66 L66 60 L72 70 L78 62 L84 66 L84 124 Z" />
          <path d="M140 124 L140 90 Q160 70 180 90 L180 124 L172 124 L172 96 Q160 84 148 96 L148 124 Z" />
          <path d="M250 124 L250 52 L262 40 L274 52 L274 80 L268 86 L274 92 L274 124 Z" />
          <path d="M320 124 L320 84 L346 84 L346 100 L340 106 L346 124 Z" />
        </g>
        <g fill="#7fe0ff" opacity={0.35}>
          <rect x={256} y={60} width={4} height={6} />
          <rect x={64} y={80} width={4} height={6} />
        </g>
      </>
    ),
    mid: (
      <>
        <path d="M0 142 Q90 132 190 138 Q290 144 400 132 L400 160 L0 160 Z" fill={NEAR} />
        {/* toppled column */}
        <g transform="translate(296 132)">
          <rect x={0} y={-10} width={60} height={10} rx={2} fill="#3f6f7a" />
          <g stroke="#2a4f5a" strokeWidth={1}>
            <path d="M12 -10 L12 0 M24 -10 L24 0 M36 -10 L36 0 M48 -10 L48 0" />
          </g>
        </g>
        <g transform="translate(36 140)">
          <rect x={-8} y={-44} width={16} height={44} fill="#3f6f7a" />
          <path d="M-8 -44 L-4 -50 L2 -46 L8 -52 L8 -44 Z" fill="#3f6f7a" />
          <rect x={-11} y={-4} width={22} height={4} fill="#335f6a" />
        </g>
        <Kelp x={62} y={142} h={44} cls="scn-sway" />
        <Kelp x={74} y={142} h={30} cls="scn-sway b" />
        <Kelp x={378} y={134} h={50} cls="scn-sway b" />
        <Kelp x={270} y={136} h={26} cls="scn-sway" />
      </>
    ),
    ground: (
      <g>
        <ellipse cx={30} cy={40} rx={9} ry={4} fill="#5a7f86" />
        <ellipse cx={370} cy={100} rx={12} ry={5} fill="#5a7f86" />
        <path d="M200 16 l5 -5 l5 5 z" fill="#e8b4a0" />
        <path d="M100 140 q6 -8 12 0 z" fill="#e8b4a0" />
      </g>
    ),
    fx: 'bubbles',
    count: 7,
  },

  snowpeak: {
    sky: (
      <>
        <circle cx={310} cy={42} r={16} fill="#fffbe8" />
        <circle cx={310} cy={42} r={30} fill="#fffbe8" opacity={0.4} />
      </>
    ),
    far: (
      <>
        <path
          d="M0 124 L70 50 L110 88 L170 30 L240 104 L290 60 L340 92 L400 54 L400 160 L0 160 Z"
          fill="#a9bed6"
        />
        <path
          d="M70 50 L84 65 L76 64 L70 72 L62 62 L56 65 Z M170 30 L190 51 L180 50 L172 58 L162 49 L150 51 Z M290 60 L304 75 L296 74 L290 80 L282 72 L276 74 Z M400 54 L400 70 L390 66 L382 72 L380 74 Z"
          fill="#fff"
        />
      </>
    ),
    mid: (
      <>
        <path d="M0 140 Q90 120 180 132 Q270 144 330 124 Q370 114 400 122 L400 160 L0 160 Z" fill="#f4f8ff" />
        <Pine x={22} y={140} s={1.1} />
        <Pine x={52} y={136} s={0.85} />
        <Pine x={386} y={124} s={0.9} />
        {/* cocoa hut */}
        <g transform="translate(330 128)">
          <rect x={10} y={-42} width={6} height={14} fill="#7a4f3a" />
          <rect x={-22} y={-26} width={44} height={26} fill="#8a5a3a" />
          <g stroke="#6b4228" strokeWidth={1}>
            <path d="M-22 -18 L22 -18 M-22 -9 L22 -9" />
          </g>
          <path d="M-28 -24 L0 -46 L28 -24 Z" fill="#6b4a3a" />
          <path d="M-29 -23 L0 -47 L29 -23 L22 -26 L0 -42 L-22 -26 Z" fill="#fff" />
          <rect x={-5} y={-14} width={10} height={14} rx={1} fill="#4a2a18" />
          <rect x={-17} y={-20} width={8} height={8} rx={1} fill="#ffd56b" />
          <rect x={9} y={-20} width={8} height={8} rx={1} fill="#ffd56b" />
        </g>
      </>
    ),
    ground: (
      <g fill="#fff" opacity={0.85}>
        <ellipse cx={20} cy={40} rx={26} ry={7} />
        <ellipse cx={380} cy={110} rx={30} ry={8} />
        <ellipse cx={210} cy={12} rx={20} ry={4} />
      </g>
    ),
    fx: 'snow',
    count: 10,
  },

  abyss: {
    sky: (
      <>
        <ellipse
          cx={240}
          cy={60}
          rx={140}
          ry={36}
          fill="#7a4fd0"
          opacity={0.12}
          transform="rotate(-12 240 60)"
        />
        <Stars pts={STARFIELD} fill="#e6e0ff" />
        <Stars
          pts={[
            [80, 100, 0.9],
            [150, 120, 1.1],
            [320, 110, 0.8],
            [370, 140, 1],
            [30, 150, 0.9],
          ]}
          fill="#bfaaff"
        />
      </>
    ),
    far: (
      <>
        <g className="scn-bob">
          <g fill="#3a2a5e">
            <path d="M60 70 L104 70 L92 84 L84 104 L76 86 Z" />
            <path d="M280 54 L340 54 L326 72 L314 98 L300 74 Z" />
            <path d="M190 96 L214 96 L206 106 L202 116 L196 106 Z" />
          </g>
          <g fill="#a77bff" opacity={0.75}>
            <path d="M60 70 L104 70 L101 73 L63 73 Z" />
            <path d="M280 54 L340 54 L337 57 L283 57 Z" />
            <path d="M190 96 L214 96 L212 98 L192 98 Z" />
          </g>
          <circle cx={84} cy={66} r={2} fill="#e6e0ff" />
        </g>
        <path
          d="M0 140 L60 128 L120 136 L170 124 L240 132 L300 120 L400 134 L400 160 L0 160 Z"
          fill={FAR}
          opacity={0.7}
        />
      </>
    ),
    mid: (
      <>
        {/* broken cliff edges falling away into nothing */}
        <path d="M0 132 L40 130 L56 138 L50 150 L64 160 L0 160 Z" fill={NEAR} />
        <path d="M400 126 L360 128 L346 136 L352 148 L338 160 L400 160 Z" fill={NEAR} />
        <g fill={NEAR}>
          <path d="M70 148 L80 148 L76 156 Z" />
          <path d="M322 144 L334 144 L328 154 Z" />
        </g>
        <path d="M40 130 L56 138" stroke="#a77bff" strokeWidth={1} opacity={0.6} />
        <path d="M360 128 L346 136" stroke="#a77bff" strokeWidth={1} opacity={0.6} />
      </>
    ),
    ground: (
      <g fill="#cfc2ff">
        {[
          [20, 30],
          [80, 90],
          [150, 20],
          [260, 50],
          [330, 130],
          [380, 70],
          [190, 150],
          [40, 140],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1} opacity={0.6} />
        ))}
      </g>
    ),
    fx: 'twinkle',
    count: 8,
  },

  starglade: {
    sky: (
      <>
        <Stars pts={STARFIELD} fill="#fff6d8" />
        <Moon x={300} y={42} r={18} fill="#fff1c4" />
      </>
    ),
    far: (
      <>
        <path d="M0 122 Q100 104 200 114 Q300 124 400 106 L400 160 L0 160 Z" fill={FAR} />
        {[14, 40, 66, 92, 300, 326, 352, 378].map((x, i) => (
          <Tree key={x} x={x} y={116 - (i % 3) * 3} s={0.85 + (i % 2) * 0.15} fill={FAR} />
        ))}
      </>
    ),
    mid: (
      <>
        <path d="M0 140 Q100 126 200 134 Q300 142 400 128 L400 160 L0 160 Z" fill={NEAR} />
        <GlowShroom x={30} y={140} s={1.6} cap="#7ce8ff" />
        <GlowShroom x={52} y={142} s={1.1} cap="#b79cff" />
        <GlowShroom x={362} y={132} s={1.4} cap="#ffd56b" />
        <GlowShroom x={380} y={134} s={0.9} cap="#7ce8ff" />
        <g stroke="#3f6a6a" strokeWidth={1.6} strokeLinecap="round">
          <path d="M80 142 Q78 128 84 120 M88 142 Q90 130 96 124 M330 134 Q328 120 334 112" />
        </g>
      </>
    ),
    ground: (
      <g>
        {[
          [24, 40, '#7ce8ff'],
          [70, 80, '#ffd56b'],
          [350, 50, '#b79cff'],
          [376, 120, '#7ce8ff'],
          [180, 16, '#ffd56b'],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <ellipse cx={x as number} cy={y as number} rx={10} ry={4} fill={c as string} opacity={0.18} />
            <circle cx={x as number} cy={y as number} r={1.6} fill={c as string} />
          </g>
        ))}
      </g>
    ),
    fx: 'fireflies',
    count: 8,
  },

  eclipse: {
    sky: (
      <>
        <circle cx={200} cy={52} r={44} fill="#ff4a6a" opacity={0.14} />
        <circle cx={200} cy={52} r={30} fill="#ffc46b" opacity={0.85} />
        <circle cx={200} cy={52} r={27} fill="#14080f" />
        <Stars pts={STARFIELD.filter((_, i) => i % 2 === 0)} fill="#ffb0c0" />
      </>
    ),
    far: (
      <>
        <g fill={FAR}>
          <path d="M20 124 L20 76 L28 60 L36 76 L36 124 Z" />
          <path d="M60 124 L60 90 L66 80 L72 90 L72 124 Z" />
          <path d="M328 124 L328 90 L334 80 L340 90 L340 124 Z" />
          <path d="M364 124 L364 70 L372 52 L380 70 L380 124 Z" />
          <path d="M0 124 L400 124 L400 160 L0 160 Z" />
        </g>
      </>
    ),
    mid: (
      <>
        {/* the throne on its dais, centre back */}
        <g transform="translate(200 132)">
          <path d="M-60 0 L-50 -8 L50 -8 L60 0 Z" fill="#3a1a2a" />
          <path d="M-44 -8 L-36 -16 L36 -16 L44 -8 Z" fill="#4a2034" />
          <path d="M-18 -16 L-18 -60 L-10 -74 L0 -64 L10 -74 L18 -60 L18 -16 Z" fill="#2a1020" />
          <path d="M-12 -24 L-12 -54 L0 -60 L12 -54 L12 -24 Z" fill="#8a1a3a" />
          <rect x={-24} y={-30} width={48} height={8} rx={2} fill="#2a1020" />
          <circle cx={0} cy={-66} r={3} fill="#ffc46b" />
        </g>
        <path d="M0 142 L130 132 L270 132 L400 142 L400 160 L0 160 Z" fill={NEAR} />
        {/* banners */}
        {[96, 304].map((x) => (
          <g key={x} transform={`translate(${x} 132)`}>
            <rect x={-1.5} y={-60} width={3} height={60} fill="#2a1020" />
            <path d="M-10 -58 L10 -58 L10 -24 L0 -30 L-10 -24 Z" fill="#8a1a3a" />
            <circle cx={0} cy={-46} r={3} fill="#ffc46b" />
          </g>
        ))}
      </>
    ),
    ground: (
      <g>
        <path d="M150 0 L250 0 L300 160 L100 160 Z" fill="#6a1030" opacity={0.35} />
      </g>
    ),
    fx: 'motes',
    count: 6,
  },
};

export const SCENERY_ZONES = Object.keys(SCENERY);

/** Smoke particles start at the chimneys (percent of the band). */
const SMOKE_ORIGINS: [number, number][] = [
  [14, 56],
  [28, 63],
  [88, 56],
];

/** Deterministic pseudo-random placement so renders are stable. */
function rand(i: number, salt: number) {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function Fx({ kind, count }: { kind: FxKind; count: number }) {
  return (
    <div className={`scn-fx fx-${kind}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const style = {
          '--x': `${Math.round(rand(i, 1) * 92 + 4)}%`,
          '--y': `${Math.round(rand(i, 2) * 70 + 10)}%`,
          '--d': `${(5 + rand(i, 3) * 6).toFixed(1)}s`,
          '--delay': `${(-rand(i, 4) * 10).toFixed(1)}s`,
          '--s': `${(0.7 + rand(i, 5) * 0.6).toFixed(2)}`,
        } as Record<string, string>;
        if (kind === 'smoke') {
          const o = SMOKE_ORIGINS[i % SMOKE_ORIGINS.length]!;
          style['--x'] = `${o[0]}%`;
          style['--y'] = `${o[1]}%`;
        }
        return <span key={i} style={style as CSSProperties} />;
      })}
    </div>
  );
}

export function ZoneScenery({ zoneId }: { zoneId: string }) {
  const sc = SCENERY[zoneId] ?? SCENERY.meadow!;
  return (
    <>
      {sc.sky && (
        <svg
          className="scn-sky"
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
        >
          {sc.sky}
        </svg>
      )}
      <svg className="scn-band scn-far" viewBox="0 0 400 160" aria-hidden="true">
        {sc.far}
      </svg>
      <div className="stage-floor" />
      {sc.ground && (
        <svg className="scn-ground" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
          {sc.ground}
        </svg>
      )}
      <div className="scn-band-wrap">
        <svg className="scn-band scn-mid" viewBox="0 0 400 160" aria-hidden="true">
          {sc.mid}
        </svg>
        {sc.fx === 'smoke' && <Fx kind="smoke" count={sc.count} />}
      </div>
      {sc.fx !== 'smoke' && <Fx kind={sc.fx} count={sc.count} />}
    </>
  );
}
