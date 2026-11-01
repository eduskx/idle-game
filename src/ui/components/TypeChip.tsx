import type { ReactNode } from 'react';
import type { CreatureType } from '../../engine';
import { useT } from '../../i18n/useT';

/** Small original glyphs, drawn on a 16×16 grid, filled with currentColor. */
export const TYPE_GLYPHS: Record<CreatureType, ReactNode> = {
  // Flame with an inner tongue
  ember: (
    <path d="M8.4 1.2c.4 2.2 3.9 3.9 3.9 7.6A4.3 4.3 0 0 1 8 13.2a4.3 4.3 0 0 1-4.3-4.4c0-2 1.1-3.3 2-4.1.1 1.2.6 2 1.4 2.3-.4-2.2.2-4.3 1.3-5.8Zm-.3 6.6c-.9.9-1.5 1.7-1.5 2.7a1.5 1.5 0 0 0 3 0c0-1-.6-1.8-1.5-2.7Z" />
  ),
  // Drop riding a wave crest
  tide: (
    <path d="M8 1.4 11.2 6a3.6 3.6 0 1 1-6.4 0L8 1.4Zm-1.6 5.5c-.3.6-.3 1.3.1 1.8l.9-.6c-.2-.3-.2-.7 0-1l-1-.2ZM1 13.3c1.3 0 1.9-1 3.5-1s2.2 1 3.5 1 1.9-1 3.5-1 2.2 1 3.5 1v1.4c-1.3 0-1.9-1-3.5-1s-2.2 1-3.5 1-1.9-1-3.5-1-2.2 1-3.5 1v-1.4Z" />
  ),
  // Leaf with a midrib
  grove: (
    <path d="M13.8 2.2C14.4 8.6 11.4 13 6.6 13c-1 0-1.9-.2-2.6-.6L2.4 14.6l-1-.8L3 11.6C1.8 9.8 2.2 6.9 4.2 5c2.3-2.2 6-2.3 9.6-2.8ZM4.3 11.4c1.6-2.6 3.8-4.4 6.4-5.4-2.9.6-5.3 2.2-7 4.6l.6.8Z" />
  ),
  // Faceted boulder
  stone: (
    <path d="M4.6 3.2 9.8 2l4.4 4.2-.9 6.2L7.6 14 2 11.4l-.6-5.2 3.2-3Zm1.3 1.6L3.6 7l3 1.5 2.2-4.8-2.9 1.1Zm4.2-.9L8.1 8.6l4.1-1.7-2.1-3Z" />
  ),
  // Three wind swooshes
  gale: (
    <g fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <path d="M1.5 5.5h7.8a2 2 0 1 0-2-2" />
      <path d="M1.5 9h11a2 2 0 1 1-2 2" />
      <path d="M3.5 12.6h4" />
    </g>
  ),
  // Crescent with a star glint
  shade: (
    <path d="M9.6 1.6a6.4 6.4 0 1 0 4.8 9.6A5.2 5.2 0 0 1 9.6 1.6ZM13 2.2l.5 1.3 1.3.5-1.3.5L13 5.8l-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" />
  ),
};

export function TypeIcon({ type, size = 12 }: { type: CreatureType; size?: number }) {
  return (
    <svg className="type-icon" viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <g fill="currentColor">{TYPE_GLYPHS[type]}</g>
    </svg>
  );
}

/**
 * Colored type chip with its own glyph. `compact` shows the glyph only (for tight
 * spots like portraits); the name stays available to screen readers and on hover.
 */
export function TypeChip({ type, compact = false }: { type: CreatureType; compact?: boolean }) {
  const { t } = useT();
  const name = t(`type.${type}`);
  return (
    <span
      className={`type-chip type-${type} ${compact ? 'compact' : ''}`}
      title={name}
      aria-label={compact ? name : undefined}
      role={compact ? 'img' : undefined}
    >
      <TypeIcon type={type} size={compact ? 11 : 12} />
      {!compact && <span>{name}</span>}
    </span>
  );
}

export function TypeChips({ types, compact = false }: { types: readonly CreatureType[]; compact?: boolean }) {
  return (
    <span className="type-chips">
      {types.map((ty) => (
        <TypeChip key={ty} type={ty} compact={compact} />
      ))}
    </span>
  );
}
