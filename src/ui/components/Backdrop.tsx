import type { Realm } from '../../engine';

/** Far background silhouettes per realm, tinted by CSS variables. */
export function Backdrop({ realm }: { realm: Realm }) {
  if (realm === 'umbra') {
    return (
      <svg className="stage-hills" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 120 L30 90 L44 104 L70 60 L84 80 L100 40 L112 70 L140 76 L160 50 L182 84 L210 64 L240 96 L262 58 L276 72 L300 30 L318 80 L350 70 L372 92 L400 76 L400 160 L0 160 Z"
          fill="var(--hill-far)"
        />
        <path
          d="M86 160 L86 70 L92 64 L98 70 L98 160 Z M300 160 L300 52 L306 44 L314 52 L314 160 Z"
          fill="var(--hill-far)"
        />
        <path
          d="M0 140 Q60 112 120 130 Q200 150 260 124 Q330 104 400 128 L400 160 L0 160 Z"
          fill="var(--hill-near)"
        />
        <g stroke="var(--hill-near)" strokeWidth={3} fill="none" strokeLinecap="round">
          <path d="M40 132 L40 100 M40 112 L30 102 M40 106 L50 96" />
          <path d="M350 130 L350 96 M350 110 L340 100 M350 104 L362 94" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="stage-hills" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 110 Q60 60 130 96 Q190 50 260 88 Q330 56 400 92 L400 160 L0 160 Z" fill="var(--hill-far)" />
      <path
        d="M0 136 Q80 104 160 126 Q240 146 320 116 Q370 102 400 118 L400 160 L0 160 Z"
        fill="var(--hill-near)"
      />
      <g fill="var(--hill-near)">
        <circle cx="52" cy="112" r="16" />
        <rect x="49" y="112" width="6" height="18" />
        <circle cx="338" cy="100" r="13" />
        <rect x="335" y="100" width="6" height="16" />
        <circle cx="356" cy="106" r="10" />
      </g>
    </svg>
  );
}
