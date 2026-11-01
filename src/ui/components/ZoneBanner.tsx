import { useEffect, useState } from 'react';
import { getZone } from '../../data/world';
import { useT } from '../../i18n/useT';
import { zoneTracker } from '../zoneArrival';

/**
 * Short "you entered a new zone" ribbon over the stage: zone name, realm and number.
 * Tap to skip; it fades on its own after ZONE_BANNER_MS. Reduced motion: no slide or sweep,
 * it simply appears and disappears (gated in CSS by data-motion).
 */
export function ZoneBanner({ zoneIndex }: { zoneIndex: number }) {
  const { t } = useT();
  const [seenZone, setSeenZone] = useState<number | null>(null);
  const [banner, setBanner] = useState<{ zone: number; msLeft: number } | null>(null);
  // adjust state while rendering when the zone changes (React's "storing previous props" pattern)
  if (seenZone !== zoneIndex) {
    setSeenZone(zoneIndex);
    setBanner(zoneTracker.visit(zoneIndex));
  }

  useEffect(() => {
    if (!banner) return;
    const id = window.setTimeout(() => {
      zoneTracker.dismiss();
      setBanner(null);
    }, banner.msLeft);
    return () => window.clearTimeout(id);
  }, [banner]);

  if (!banner) return null;
  const shown = banner.zone;
  const zone = getZone(shown);
  return (
    <button
      key={shown}
      type="button"
      className={`zone-banner realm-${zone.realm}`}
      onClick={() => {
        zoneTracker.dismiss();
        setBanner(null);
      }}
      aria-label={`${t('zoneBanner.reached')}: ${t(`zone.${zone.id}`)}. ${t('zoneBanner.skip')}`}
    >
      <span className="zb-kicker">
        {t('zoneBanner.reached')} · {t(`realm.${zone.realm}`)} · {t('battle.zone', { zone: shown + 1 })}
      </span>
      <strong className="zb-name">{t(`zone.${zone.id}`)}</strong>
      <span className="zb-skip" aria-hidden="true">
        {t('zoneBanner.skip')}
      </span>
    </button>
  );
}
