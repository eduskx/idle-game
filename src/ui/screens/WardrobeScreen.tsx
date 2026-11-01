import { useState, type CSSProperties } from 'react';
import {
  AVATAR_HAIR_COLORS,
  AVATAR_ITEMS,
  AVATAR_SKIN_TONES,
  AVATAR_SLOTS,
  itemsForSlot,
  type AvatarItemDef,
} from '../../data/avatar';
import { getZone } from '../../data/world';
import {
  equipAvatarItem,
  isItemUnlocked,
  setAvatarColor,
  unlockProgress,
  zoneOf,
  type AvatarSlot,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Avatar, SLOT_VIEWBOX } from '../avatar/Avatar';
import { ProgressBar, Section } from '../components/common';

function UnlockText({ item }: { item: AvatarItemDef }) {
  const { t, n } = useT();
  const u = item.unlock;
  if (u.kind === 'achievement')
    return <>{t('avatar.unlock.achievement', { name: t(`achievement.${u.id}`) })}</>;
  if (u.kind === 'stage') return <>{t('avatar.unlock.stage', { stage: n(u.stage) })}</>;
  if (u.kind === 'rebloom') return <>{t('avatar.unlock.rebloom', { count: u.count })}</>;
  return null;
}

function Swatches({
  label,
  colors,
  value,
  onPick,
}: {
  label: string;
  colors: readonly (readonly [string, string])[];
  value: number;
  onPick: (i: number) => void;
}) {
  const { t } = useT();
  return (
    <div className="swatch-row" role="radiogroup" aria-label={label}>
      <span className="swatch-label small">{label}</span>
      {colors.map(([base, shade], i) => (
        <button
          key={base}
          role="radio"
          aria-checked={value === i}
          aria-label={t('avatar.colorN', { n: i + 1 })}
          className={`swatch ${value === i ? 'active' : ''}`}
          style={{ '--sw': base, '--sw-2': shade } as CSSProperties}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}

/** Wardrobe: preview the avatar, pick a piece per slot, choose skin and hair color. */
export function WardrobeScreen() {
  const s = useGame();
  const { t } = useT();
  const [slot, setSlot] = useState<AvatarSlot>('hair');
  const realm = getZone(zoneOf(s.battle.stage)).realm;
  const unlockedCount = AVATAR_ITEMS.filter((i) => i.id !== 'none' && isItemUnlocked(s, i)).length;
  const total = AVATAR_ITEMS.filter((i) => i.id !== 'none').length;

  return (
    <Section
      title={t('avatar.title')}
      aside={<span className="pill">{t('avatar.progress', { have: unlockedCount, total })}</span>}
    >
      <div className={`wardrobe-stage realm-${realm}`}>
        <Avatar avatar={s.avatar} className="wardrobe-avatar" label={t('avatar.edit')} />
      </div>
      <Swatches
        label={t('avatar.skin')}
        colors={AVATAR_SKIN_TONES}
        value={s.avatar.skin}
        onPick={(i) => gameStore.dispatch((st) => setAvatarColor(st, 'skin', i))}
      />
      <Swatches
        label={t('avatar.hairColor')}
        colors={AVATAR_HAIR_COLORS}
        value={s.avatar.hairColor}
        onPick={(i) => gameStore.dispatch((st) => setAvatarColor(st, 'hairColor', i))}
      />

      <div className="slot-tabs" role="tablist" aria-label={t('avatar.title')}>
        {AVATAR_SLOTS.map((sl) => (
          <button
            key={sl}
            role="tab"
            aria-selected={slot === sl}
            className={`tab ${slot === sl ? 'active' : ''}`}
            onClick={() => setSlot(sl)}
          >
            {t(`avatar.slot.${sl}`)}
          </button>
        ))}
      </div>

      <ul className="wardrobe-grid" role="tabpanel">
        {itemsForSlot(slot).map((item) => {
          const unlocked = isItemUnlocked(s, item);
          const worn = s.avatar.items[slot] === item.id;
          // Hair is previewed without a hat so the cut is visible.
          const preview = {
            ...s.avatar,
            items: { ...s.avatar.items, ...(slot === 'hair' ? { hat: 'none' } : {}), [slot]: item.id },
          };
          const [have, need] = unlockProgress(s, item);
          return (
            <li key={item.id}>
              <button
                className={`wardrobe-item ${worn ? 'worn' : ''} ${unlocked ? '' : 'locked'} ${item.realm ? `set-${item.realm}` : ''}`}
                aria-pressed={worn}
                disabled={!unlocked}
                onClick={() => gameStore.dispatch((st) => equipAvatarItem(st, slot, item.id))}
              >
                <span className="wardrobe-thumb">
                  {/* Locked: only the piece itself as a silhouette, no avatar around it. */}
                  <Avatar avatar={preview} viewBox={SLOT_VIEWBOX[slot]} only={unlocked ? undefined : slot} />
                  {!unlocked && (
                    <span className="wardrobe-lock" aria-hidden="true">
                      🔒
                    </span>
                  )}
                  {worn && (
                    <span className="wardrobe-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </span>
                <strong className={unlocked ? 'wardrobe-name' : 'sr-only'}>
                  {t(`avatar.item.${slot}.${item.id}`)}
                </strong>
                {unlocked && item.realm && (
                  <span className={`set-tag set-tag-${item.realm}`}>{t(`avatar.set.${item.realm}`)}</span>
                )}
                {!unlocked && (
                  <span className="wardrobe-cond small">
                    <UnlockText item={item} />
                    {need > 1 && <ProgressBar value={have} max={need} tone="xp" />}
                  </span>
                )}
                <span className="sr-only">
                  {worn ? t('avatar.equipped') : unlocked ? '' : t('avatar.locked')}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="muted small center">{t('avatar.hint')}</p>
    </Section>
  );
}
