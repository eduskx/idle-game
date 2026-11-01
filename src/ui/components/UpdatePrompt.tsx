import { useRegisterSW } from 'virtual:pwa-register/react';
import { useT } from '../../i18n/useT';
import { gameStore } from '../../store/gameStore';

/** Shows a banner when a new version of the PWA has been downloaded. */
export function UpdatePrompt() {
  const { t } = useT();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div className="update-banner" role="alert">
      <span>{t('update.available')}</span>
      <button
        className="btn primary"
        onClick={async () => {
          await gameStore.save();
          await updateServiceWorker(true);
        }}
      >
        {t('update.reload')}
      </button>
    </div>
  );
}
