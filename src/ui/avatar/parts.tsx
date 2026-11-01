import type { CSSProperties, ReactNode } from 'react';
import type { AvatarSlot } from '../../engine/types';

/**
 * Hand-drawn paper-doll parts for the player avatar.
 *
 * Conventions (same feel as the creature art, see docs/ART_GUIDE.md):
 * - viewBox 0 0 200 300, chibi proportions (head ≈ 1/2.6 of the height), feet at y ≈ 282
 * - every part shares one pose, so any combination lines up
 * - dark tinted outline, cel shading via a darker shade color, light from the top-left
 * - colors only through CSS variables: --av-skin/-2, --av-hair/-2 and --av-<slot>-1/2/3
 *   for clothing (main, shade, detail), set by <Avatar>
 */
export const INK = '#2b1d17';

/** Render layers, back to front. */
export type Layer =
  'hairBack' | 'topBack' | 'bottom' | 'shoes' | 'top' | 'neck' | 'hairFront' | 'hat' | 'face';

export type PartArt = Partial<Record<Layer, ReactNode>>;

const v = (name: string): CSSProperties => ({ fill: `var(${name})` });
const sv = (name: string): CSSProperties => ({ stroke: `var(${name})` });

const SKIN = v('--av-skin');
const SKIN2 = v('--av-skin-2');
const HAIR = v('--av-hair');
const HAIR2 = v('--av-hair-2');
const c = (slot: AvatarSlot, n: 1 | 2 | 3) => v(`--av-${slot}-${n}`);
const cs = (slot: AvatarSlot, n: 1 | 2 | 3) => sv(`--av-${slot}-${n}`);

const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

/** Mirrors a left-side part onto the right side (the pose is symmetric). */
function Pair({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform="translate(200 0) scale(-1 1)">{children}</g>
    </>
  );
}

/** A limb/sleeve as an outlined thick stroke. */
function Tube({ d, w, style }: { d: string; w: number; style: CSSProperties }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 6} strokeLinecap="round" />
      <path d={d} fill="none" strokeWidth={w} strokeLinecap="round" style={style} />
    </>
  );
}

// ------------------------------------------------------------------ body + face

const ARM = 'M80 162 Q70 186 66 208';
const LEG = 'M91 208 L90 268';

export function BodyBack() {
  return (
    <g>
      <ellipse cx="100" cy="284" rx="44" ry="7" fill="#000" opacity={0.2} />
      <Pair>
        <Tube d={LEG} w={12} style={sv('--av-skin')} />
      </Pair>
    </g>
  );
}

export function Torso() {
  return (
    <g>
      <rect x="91" y="132" width="18" height="26" style={SKIN} {...line} />
      <path d="M80 156 Q100 148 120 156 L126 212 Q100 220 74 212 Z" style={SKIN} {...line} />
      <Pair>
        <Tube d={ARM} w={11} style={sv('--av-skin')} />
      </Pair>
    </g>
  );
}

export function Hands() {
  return (
    <Pair>
      <circle cx="65.5" cy="211" r="7.5" style={SKIN} {...line} />
      <path d="M61 213 Q65 216 69 213" fill="none" style={sv('--av-skin-2')} strokeWidth={1.6} />
    </Pair>
  );
}

export function Head() {
  return (
    <g>
      <Pair>
        <circle cx="51" cy="106" r="9" style={SKIN} {...line} />
        <path d="M49 102 Q46 106 50 110" fill="none" style={sv('--av-skin-2')} strokeWidth={2} />
      </Pair>
      <path
        d="M100 54 C130 54 151 70 151 100 C151 128 132 146 100 146 C68 146 49 128 49 100 C49 70 70 54 100 54 Z"
        style={SKIN}
        {...line}
      />
      {/* cel shade on the right cheek and under the chin */}
      <path
        d="M136 72 C148 84 150 108 142 124 C136 136 122 143 108 145 C128 136 142 116 136 72 Z"
        style={SKIN2}
        opacity={0.55}
      />
    </g>
  );
}

export function Face() {
  return (
    <g>
      <Pair>
        {/* curious, determined eyes: tall ovals with one sparkle */}
        <ellipse cx="81" cy="107" rx="6" ry="7.5" fill={INK} />
        <circle cx="79" cy="104" r="2.3" fill="#fff" />
        <circle cx="83.5" cy="110" r="1" fill="#fff" opacity={0.8} />
        <path d="M73 95 Q80 91 88 94" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        <ellipse cx="70" cy="121" rx="7" ry="4" fill="#ff8f8f" opacity={0.35} />
      </Pair>
      <path d="M93 123 Q100 129 107 122" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path
        d="M98 114 Q100 116 102 114"
        fill="none"
        style={sv('--av-skin-2')}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

// ------------------------------------------------------------------ hair

const HAIR_CAP =
  'M44 108 C38 58 66 42 100 42 C134 42 162 58 156 108 C150 88 132 76 100 76 C68 76 50 88 44 108 Z';

const HAIR_SHINE = (
  <path
    d="M66 62 Q84 50 104 50"
    fill="none"
    stroke="#fff"
    strokeWidth={4}
    strokeLinecap="round"
    opacity={0.28}
  />
);

export const HAIR_PARTS: Record<string, (hat: boolean) => PartArt> = {
  short: () => ({
    hairBack: <path d={HAIR_CAP} style={HAIR2} {...line} />,
    hairFront: (
      <g>
        <path
          d="M48 102 C44 62 66 46 100 46 C134 46 156 62 152 102 C148 90 142 84 136 82 L132 94 L122 80 L112 94 L104 78 L94 94 L86 80 L76 94 L68 82 C58 86 51 92 48 102 Z"
          style={HAIR}
          {...line}
        />
        <path d="M98 47 Q104 30 118 32 Q108 36 108 48 Z" style={HAIR} {...line} />
        {HAIR_SHINE}
      </g>
    ),
  }),
  bob: () => ({
    hairBack: (
      <path
        d="M42 104 C36 56 66 40 100 40 C134 40 164 56 158 104 L160 140 Q146 150 132 142 L68 142 Q54 150 40 140 Z"
        style={HAIR2}
        {...line}
      />
    ),
    hairFront: (
      <g>
        <path
          d="M46 104 C42 60 66 46 100 46 C134 46 158 60 154 104 L156 138 Q148 142 142 138 L140 96 Q100 86 60 96 L58 138 Q52 142 44 138 Z"
          style={HAIR}
          {...line}
        />
        <path d="M60 96 Q100 84 140 96" fill="none" style={sv('--av-hair-2')} strokeWidth={2.4} />
        {HAIR_SHINE}
      </g>
    ),
  }),
  braids: () => ({
    hairBack: <path d={HAIR_CAP} style={HAIR2} {...line} />,
    hairFront: (
      <g>
        <Pair>
          {[120, 134, 148, 162].map((y) => (
            <ellipse key={y} cx={y < 140 ? 52 : 54} cy={y} rx="8.5" ry="8" style={HAIR} {...line} />
          ))}
          <rect x="47" y="168" width="14" height="6" rx="3" fill="#e65a4f" {...line} strokeWidth={2.2} />
          <path d="M50 174 L48 186 L54 180 L58 188 L58 174 Z" style={HAIR} {...line} strokeWidth={2.2} />
        </Pair>
        <path
          d="M47 108 C42 62 66 46 100 46 C134 46 158 62 153 108 C146 88 130 78 103 76 L100 86 L97 76 C70 78 54 88 47 108 Z"
          style={HAIR}
          {...line}
        />
        {HAIR_SHINE}
      </g>
    ),
  }),
  bun: (hat) => ({
    hairBack: (
      <g>
        {!hat && (
          <>
            <circle cx="100" cy="38" r="19" style={HAIR2} {...line} />
            <path d="M88 32 Q100 24 112 32" fill="none" style={sv('--av-hair')} strokeWidth={3} />
          </>
        )}
        <path d={HAIR_CAP} style={HAIR2} {...line} />
      </g>
    ),
    hairFront: (
      <g>
        <path
          d="M48 104 C44 62 66 46 100 46 C134 46 156 62 152 104 C148 86 134 76 118 74 C104 86 80 90 62 88 C54 92 50 98 48 104 Z"
          style={HAIR}
          {...line}
        />
        <path
          d="M55 102 Q50 118 56 130"
          fill="none"
          style={sv('--av-hair')}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M145 102 Q150 118 144 130"
          fill="none"
          style={sv('--av-hair')}
          strokeWidth={4}
          strokeLinecap="round"
        />
        {HAIR_SHINE}
      </g>
    ),
  }),
  veil: () => ({
    hairBack: (
      <path
        d="M42 102 C36 54 66 38 100 38 C134 38 164 54 158 102 L164 204 Q150 214 136 206 L64 206 Q50 214 36 204 Z"
        style={HAIR2}
        {...line}
      />
    ),
    hairFront: (
      <g>
        <path
          d="M47 106 C42 60 66 44 100 44 C134 44 158 60 153 112 L150 136 Q142 128 135 130 Q130 112 108 96 Q88 86 70 90 Q56 94 47 106 Z"
          style={HAIR}
          {...line}
        />
        <path d="M108 96 Q126 108 135 130" fill="none" style={sv('--av-hair-2')} strokeWidth={2.4} />
        <path
          d="M120 60 Q140 70 146 96"
          fill="none"
          stroke="#fff"
          strokeWidth={3.5}
          strokeLinecap="round"
          opacity={0.25}
        />
      </g>
    ),
  }),
};

// ------------------------------------------------------------------ tops

const TOP_TORSO = 'M76 154 Q100 146 124 154 L129 214 Q100 222 71 214 Z';
const SHORT_SLEEVE = 'M80 161 L73 182';
const LONG_SLEEVE = 'M80 161 Q70 186 67 203';

function TopShade() {
  return <path d="M117 156 L124 154 L129 214 Q122 217 116 218 Q122 186 117 156 Z" style={c('top', 2)} />;
}

export const TOP_PARTS: Record<string, PartArt> = {
  tee: {
    top: (
      <g>
        <path d={TOP_TORSO} style={c('top', 1)} {...line} />
        <TopShade />
        <Pair>
          <Tube d={SHORT_SLEEVE} w={17} style={cs('top', 1)} />
        </Pair>
        <path d="M90 151 Q100 160 110 151" fill="none" style={cs('top', 2)} strokeWidth={3} />
        {/* little sun print */}
        <circle cx="100" cy="184" r="7" style={c('top', 3)} {...line} strokeWidth={2} />
        <g style={cs('top', 3)} strokeWidth={2.4} strokeLinecap="round">
          <path d="M100 171 L100 168" />
          <path d="M100 197 L100 200" />
          <path d="M87 184 L84 184" />
          <path d="M113 184 L116 184" />
        </g>
      </g>
    ),
  },
  vest: {
    top: (
      <g>
        <path d={TOP_TORSO} style={c('top', 3)} {...line} />
        <Pair>
          <Tube d={SHORT_SLEEVE} w={17} style={cs('top', 3)} />
          <path d="M76 154 Q86 149 93 151 L96 216 Q84 217 71 214 Z" style={c('top', 1)} {...line} />
          <rect x="77" y="186" width="12" height="11" rx="2" style={c('top', 2)} {...line} strokeWidth={2} />
        </Pair>
        <path d="M120 156 L124 154 L129 214 Q124 216 120 216 Z" style={c('top', 2)} />
        {/* tamer badge: a little paw */}
        <circle cx="114" cy="170" r="6" fill="#f2d27a" {...line} strokeWidth={2} />
        <circle cx="114" cy="171.5" r="2" fill={INK} />
        <g fill={INK}>
          <circle cx="110.8" cy="167.6" r="1" />
          <circle cx="114" cy="166.3" r="1" />
          <circle cx="117.2" cy="167.6" r="1" />
        </g>
      </g>
    ),
  },
  knit: {
    top: (
      <g>
        <path d="M74 154 Q100 144 126 154 L131 216 Q100 224 69 216 Z" style={c('top', 1)} {...line} />
        <TopShade />
        <Pair>
          <Tube d={LONG_SLEEVE} w={19} style={cs('top', 1)} />
          <Tube d="M68.5 198 L67 204" w={18} style={cs('top', 2)} />
        </Pair>
        <path d="M70 208 Q100 216 130 208 L131 216 Q100 224 69 216 Z" style={c('top', 2)} {...line} />
        <ellipse cx="100" cy="152" rx="16" ry="6.5" style={c('top', 2)} {...line} />
        {/* cozy pattern band: tiny hearts on a zigzag */}
        <path
          d="M74 172 L80 178 L86 172 L92 178 L98 172 L104 178 L110 172 L116 178 L122 172 L127 177"
          fill="none"
          style={cs('top', 3)}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        {[83, 100, 117].map((x) => (
          <path
            key={x}
            d={`M${x} 194 c-4 -4 -7 -1 -5 2 l5 5 l5 -5 c2 -3 -1 -6 -5 -2 z`}
            style={c('top', 3)}
          />
        ))}
      </g>
    ),
  },
  shroud: {
    topBack: (
      <path
        d="M36 122 C28 52 62 30 100 30 C138 30 172 52 164 122 C162 146 150 158 136 162 L64 162 C50 158 38 146 36 122 Z"
        style={c('top', 1)}
        {...line}
      />
    ),
    top: (
      <g>
        <path d={TOP_TORSO} style={c('top', 2)} {...line} />
        <Pair>
          <Tube d={LONG_SLEEVE} w={17} style={cs('top', 2)} />
        </Pair>
        {/* ragged cape over the shoulders */}
        <path
          d="M70 150 Q100 140 130 150 L142 196 L132 192 L124 202 L114 194 L100 204 L86 194 L76 202 L68 192 L58 196 Z"
          style={c('top', 1)}
          {...line}
        />
        <path
          d="M62 190 L68 186 L76 196 L86 188 L100 198 L114 188 L124 196 L132 186 L138 190"
          fill="none"
          style={cs('top', 3)}
          strokeWidth={2}
          opacity={0.75}
        />
        <path d="M118 152 L130 150 L142 196 L134 193 Q130 170 118 152 Z" style={c('top', 2)} opacity={0.7} />
        {/* spectral clasp */}
        <circle cx="100" cy="160" r="6" style={c('top', 3)} {...line} strokeWidth={2.2} />
        <circle cx="98" cy="158" r="1.8" fill="#fff" opacity={0.8} />
      </g>
    ),
  },
};

// ------------------------------------------------------------------ bottoms

export const BOTTOM_PARTS: Record<string, PartArt> = {
  shorts: {
    bottom: (
      <g>
        <path
          d="M73 206 L127 206 L131 238 L104 240 L100 226 L96 240 L69 238 Z"
          style={c('bottom', 1)}
          {...line}
        />
        <path d="M118 208 L127 206 L131 238 L121 239 Z" style={c('bottom', 2)} />
        <path d="M72 230 L96 232 M104 232 L130 230" fill="none" style={cs('bottom', 3)} strokeWidth={2.2} />
        <path
          d="M73 206 L127 206 L127.6 212 L72.6 212 Z"
          style={c('bottom', 2)}
          {...line}
          strokeWidth={2.4}
        />
      </g>
    ),
  },
  trousers: {
    bottom: (
      <g>
        <path
          d="M73 206 L127 206 L123 266 L103 266 L100 228 L97 266 L77 266 Z"
          style={c('bottom', 1)}
          {...line}
        />
        <path d="M118 208 L127 206 L123 266 L117 266 Z" style={c('bottom', 2)} />
        <Pair>
          <path d="M77 258 L97 258 L97 266 L77 266 Z" style={c('bottom', 3)} {...line} strokeWidth={2.4} />
          <path d="M80 214 Q86 220 92 214" fill="none" style={cs('bottom', 2)} strokeWidth={2} />
        </Pair>
        <path
          d="M73 206 L127 206 L127.4 212 L72.6 212 Z"
          style={c('bottom', 2)}
          {...line}
          strokeWidth={2.4}
        />
      </g>
    ),
  },
  patchskirt: {
    bottom: (
      <g>
        <path d="M74 206 L126 206 L142 246 Q100 256 58 246 Z" style={c('bottom', 1)} {...line} />
        <path d="M116 207 L126 206 L142 246 Q134 249 126 250 Z" style={c('bottom', 2)} />
        <rect
          x="78"
          y="222"
          width="14"
          height="13"
          rx="2"
          transform="rotate(-8 85 228)"
          style={c('bottom', 3)}
          {...line}
          strokeWidth={2}
        />
        <rect
          x="106"
          y="230"
          width="12"
          height="11"
          rx="2"
          transform="rotate(10 112 235)"
          fill="#7fbfa0"
          {...line}
          strokeWidth={2}
        />
        <path
          d="M62 242 Q100 251 138 242"
          fill="none"
          style={cs('bottom', 3)}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <path d="M74 206 L126 206 L127 212 L73 212 Z" style={c('bottom', 2)} {...line} strokeWidth={2.4} />
      </g>
    ),
  },
  nightwrap: {
    bottom: (
      <g>
        <path
          d="M74 206 L126 206 L136 258 L126 252 L118 262 L108 254 L100 264 L92 254 L82 262 L74 252 L64 258 Z"
          style={c('bottom', 1)}
          {...line}
        />
        <path d="M100 210 L106 256" fill="none" style={cs('bottom', 2)} strokeWidth={3} />
        <path d="M116 210 L126 206 L136 258 L126 252 Q122 228 116 210 Z" style={c('bottom', 2)} />
        {/* glowing sash knotted on the side */}
        <path d="M73 210 L127 210 L126 218 L74 218 Z" style={c('bottom', 3)} {...line} strokeWidth={2.4} />
        <path
          d="M118 218 L124 238 L116 234 L112 242 L112 218 Z"
          style={c('bottom', 3)}
          {...line}
          strokeWidth={2.2}
        />
      </g>
    ),
  },
};

// ------------------------------------------------------------------ shoes (left shoe, mirrored)

export const SHOE_PARTS: Record<string, PartArt> = {
  sneakers: {
    shoes: (
      <Pair>
        <path
          d="M82 264 Q90 260 98 263 L99 276 Q99 282 94 282 L76 282 Q68 282 70 274 Q72 268 82 264 Z"
          style={c('shoes', 1)}
          {...line}
        />
        <path d="M70 278 L99 278" style={cs('shoes', 2)} strokeWidth={3} />
        <path
          d="M78 270 Q86 266 94 272"
          fill="none"
          style={cs('shoes', 3)}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Pair>
    ),
  },
  boots: {
    shoes: (
      <Pair>
        <path
          d="M81 240 L99 240 L99 276 Q99 282 94 282 L74 282 Q66 282 68 274 Q70 266 81 262 Z"
          style={c('shoes', 1)}
          {...line}
        />
        <path d="M78 238 L101 238 L101 248 L78 248 Z" style={c('shoes', 3)} {...line} strokeWidth={2.4} />
        <path d="M68 278 L99 278" style={cs('shoes', 2)} strokeWidth={3.5} />
        <path d="M86 254 L94 254 M86 262 L94 262" style={cs('shoes', 2)} strokeWidth={2} />
      </Pair>
    ),
  },
  slippers: {
    shoes: (
      <Pair>
        <ellipse cx="87" cy="274" rx="15" ry="9" style={c('shoes', 1)} {...line} />
        <path
          d="M74 272 Q87 264 100 272"
          fill="none"
          style={cs('shoes', 3)}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <path d="M76 279 Q88 284 100 278" fill="none" style={cs('shoes', 2)} strokeWidth={2.4} />
        <circle cx="76" cy="268" r="5" style={c('shoes', 3)} {...line} strokeWidth={2} />
      </Pair>
    ),
  },
  clawboots: {
    shoes: (
      <Pair>
        <path
          d="M82 244 L99 244 L99 282 L70 282 Q60 281 62 272 Q68 277 74 273 Q78 268 82 260 Z"
          style={c('shoes', 1)}
          {...line}
        />
        <path
          d="M80 242 L102 242 L98 250 L90 246 L82 250 Z"
          style={c('shoes', 2)}
          {...line}
          strokeWidth={2.2}
        />
        <path
          d="M62 272 L56 268 L64 276 Z M70 281 L64 284 L72 283 Z"
          style={c('shoes', 3)}
          {...line}
          strokeWidth={1.8}
        />
        <path d="M90 256 L96 252" style={cs('shoes', 3)} strokeWidth={2} />
      </Pair>
    ),
  },
};

// ------------------------------------------------------------------ hats

export const HAT_PARTS: Record<string, PartArt> = {
  none: {},
  bobble: {
    hat: (
      <g>
        <path d="M52 86 C50 50 72 36 100 36 C128 36 150 50 148 86 Z" style={c('hat', 1)} {...line} />
        <path d="M128 42 C142 52 148 66 148 86 L136 86 C138 68 134 54 128 42 Z" style={c('hat', 2)} />
        {[70, 86, 100, 114, 130].map((x) => (
          <path
            key={x}
            d={`M${x} ${x === 100 ? 40 : 46} Q${x + (x - 100) * 0.08} 64 ${x} 80`}
            fill="none"
            style={cs('hat', 2)}
            strokeWidth={2}
          />
        ))}
        <path d="M46 80 Q100 68 154 80 L154 92 Q100 80 46 92 Z" style={c('hat', 3)} {...line} />
        <circle cx="100" cy="30" r="12" style={c('hat', 3)} {...line} />
        <path
          d="M94 24 Q98 21 103 23"
          fill="none"
          stroke="#fff"
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={0.7}
        />
      </g>
    ),
  },
  sprout: {
    hat: (
      <g>
        <path d="M100 56 Q98 40 104 26" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path
          d="M100 56 Q98 40 104 26"
          fill="none"
          style={cs('hat', 2)}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path d="M101 44 Q84 30 70 38 Q84 52 101 44 Z" style={c('hat', 1)} {...line} />
        <path d="M102 38 Q120 22 134 30 Q120 46 102 38 Z" style={c('hat', 1)} {...line} />
        <path
          d="M74 39 Q88 42 100 43 M130 31 Q116 35 104 38"
          fill="none"
          style={cs('hat', 2)}
          strokeWidth={1.8}
        />
        <ellipse cx="104" cy="22" rx="6" ry="7.5" style={c('hat', 3)} {...line} strokeWidth={2.4} />
      </g>
    ),
  },
  crescent: {
    hat: (
      <g>
        <ellipse cx="100" cy="74" rx="68" ry="13" style={c('hat', 1)} {...line} />
        <path
          d="M64 72 Q72 44 90 24 Q104 6 132 2 Q116 14 114 28 Q122 52 136 72 Q100 80 64 72 Z"
          style={c('hat', 1)}
          {...line}
        />
        <path d="M114 28 Q122 52 136 72 Q128 74 122 75 Q118 50 114 28 Z" style={c('hat', 2)} />
        <path
          d="M68 62 Q100 70 132 62 L134 70 Q100 78 66 70 Z"
          style={c('hat', 3)}
          {...line}
          strokeWidth={2.4}
        />
        {/* crescent moon emblem */}
        <path
          d="M96 34 A12 12 0 1 0 108 52 A9 9 0 1 1 96 34 Z"
          style={c('hat', 3)}
          {...line}
          strokeWidth={2}
        />
      </g>
    ),
  },
};

// ------------------------------------------------------------------ accessories

export const ACCESSORY_PARTS: Record<string, PartArt> = {
  none: {},
  glasses: {
    face: (
      <g>
        <Pair>
          <circle cx="81" cy="107" r="11.5" style={c('accessory', 3)} opacity={0.35} />
          <circle cx="81" cy="107" r="11.5" fill="none" style={cs('accessory', 1)} strokeWidth={3} />
          <path d="M70 104 L58 100" style={cs('accessory', 1)} strokeWidth={2.6} strokeLinecap="round" />
        </Pair>
        <path d="M92 106 Q100 101 108 106" fill="none" style={cs('accessory', 1)} strokeWidth={2.6} />
      </g>
    ),
  },
  scarf: {
    neck: (
      <g>
        <path d="M80 148 Q100 160 120 148 L125 162 Q100 176 75 162 Z" style={c('accessory', 1)} {...line} />
        <path d="M80 160 L74 196 L90 198 L92 164 Z" style={c('accessory', 1)} {...line} />
        <path d="M76 176 L91 178 M75 186 L90 188" style={cs('accessory', 3)} strokeWidth={3} />
        <path
          d="M76 198 L75 204 M81 199 L80 205 M86 199 L86 205"
          style={cs('accessory', 2)}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <path d="M104 162 Q114 160 122 155" fill="none" style={cs('accessory', 2)} strokeWidth={2.4} />
      </g>
    ),
  },
  mothpin: {
    neck: (
      <g transform="translate(112 176)">
        <path d="M0 0 Q-14 -14 -16 -2 Q-14 6 0 2 Z" style={c('accessory', 1)} {...line} strokeWidth={2} />
        <path d="M0 0 Q14 -14 16 -2 Q14 6 0 2 Z" style={c('accessory', 1)} {...line} strokeWidth={2} />
        <path
          d="M0 2 Q-10 12 -6 14 Q0 10 0 4 Z M0 2 Q10 12 6 14 Q0 10 0 4 Z"
          style={c('accessory', 2)}
          {...line}
          strokeWidth={1.8}
        />
        <circle cx="-9" cy="-4" r="2.2" style={c('accessory', 3)} />
        <circle cx="9" cy="-4" r="2.2" style={c('accessory', 3)} />
        <ellipse cx="0" cy="3" rx="2.4" ry="6" style={c('accessory', 3)} {...line} strokeWidth={1.6} />
      </g>
    ),
  },
};

export const PARTS_BY_SLOT: Record<Exclude<AvatarSlot, 'hair'>, Record<string, PartArt>> = {
  top: TOP_PARTS,
  bottom: BOTTOM_PARTS,
  shoes: SHOE_PARTS,
  hat: HAT_PARTS,
  accessory: ACCESSORY_PARTS,
};
