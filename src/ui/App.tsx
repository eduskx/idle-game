import { lazy, Suspense, useEffect, useState } from 'react';
import { getZone } from '../data/world';
import { zoneOf } from '../engine';
import { formatDuration } from '../i18n';
import { useT } from '../i18n/useT';
import { gameStore, useGame, useUi } from '../store/gameStore';
import { Currency, Modal } from './components/common';
import { UpdatePrompt } from './components/UpdatePrompt';
import { BattleScreen } from './screens/BattleScreen';

// Secondary screens are split into their own chunks so the first paint stays small.
const TeamScreen = lazy(() => import('./screens/TeamScreen').then((m) => ({ default: m.TeamScreen })));
const SummonScreen = lazy(() => import('./screens/SummonScreen').then((m) => ({ default: m.SummonScreen })));
const UpgradesScreen = lazy(() => import('./screens/UpgradesScreen').then((m) => ({ default: m.UpgradesScreen })));
const RebloomScreen = lazy(() => import('./screens/RebloomScreen').then((m) => ({ default: m.RebloomScreen })));
const MoreScreen = lazy(() => import('./screens/MoreScreen').then((m) => ({ default: m.MoreScreen })));

type Tab = 'battle' | 'team' | 'summon' | 'upgrades' | 'rebloom' | 'more';

const TABS: { id: Tab; icon: string }[] = [
  { id: 'battle', icon: '⚔️' },
  { id: 'team', icon: '🐾' },
  { id: 'summon', icon: '🔮' },
  { id: 'upgrades', icon: '⬆️' },
  { id: 'rebloom', icon: '🌸' },
  { id: 'more', icon: '☰' },
];

const TAB_KEY = 'hollowbloom.tab';

function readTab(): Tab {
  try {
    const v = localStorage.getItem(TAB_KEY);
    if (v && TABS.some((x) => x.id === v)) return v as Tab;
  } catch {
    /* storage unavailable */
  }
  return 'battle';
}

export function App() {
  const s = useGame();
  const ui = useUi();
  const { t, n, lang } = useT();
  const [tab, setTab] = useState<Tab>(readTab);
  const realm = getZone(zoneOf(s.battle.stage)).realm;

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, tab);
    } catch {
      /* ignore */
    }
  }, [tab]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.motion = s.settings.reducedMotion ? 'reduced' : 'full';
  }, [lang, s.settings.reducedMotion]);

  useEffect(() => {
    if (ui.newAchievements.length === 0) return;
    for (const id of gameStore.consumeAchievements()) {
      gameStore.toast(`🏆 ${t(`achievement.${id}`)}`, 'success');
    }
  }, [ui.newAchievements, t]);

  const report = ui.offlineReport;

  return (
    <div className={`app realm-bg-${realm}`}>
      <header className="topbar">
        <h1 className="logo">{t('app.title')}</h1>
        <div className="currencies">
          <Currency kind="gold" amount={s.currencies.gold} />
          <Currency kind="essence" amount={s.currencies.essence} />
          {(s.currencies.seeds > 0 || s.lifetime.reblooms > 0) && <Currency kind="seeds" amount={s.currencies.seeds} />}
        </div>
      </header>

      <main className="content" id="main">
        <Suspense fallback={<p className="muted center">…</p>}>
          {tab === 'battle' && <BattleScreen />}
          {tab === 'team' && <TeamScreen />}
          {tab === 'summon' && <SummonScreen />}
          {tab === 'upgrades' && <UpgradesScreen />}
          {tab === 'rebloom' && <RebloomScreen />}
          {tab === 'more' && <MoreScreen />}
        </Suspense>
      </main>

      <nav className="bottom-nav" aria-label="Main">
        {TABS.map((x) => (
          <button key={x.id} className={`nav-btn ${tab === x.id ? 'active' : ''}`} aria-current={tab === x.id ? 'page' : undefined} onClick={() => setTab(x.id)}>
            <span aria-hidden="true">{x.icon}</span>
            <span className="nav-label">{t(`nav.${x.id}`)}</span>
          </button>
        ))}
      </nav>

      <div className="toasts" role="status" aria-live="polite">
        {ui.toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.tone}`}>
            {toast.text}
          </div>
        ))}
      </div>

      {report && (
        <Modal title={t('offline.title')} onClose={() => gameStore.dismissOffline()}>
          <p>{t('offline.body', { time: formatDuration(report.seconds) })}</p>
          <ul className="offline-rewards">
            <li>🪙 +{n(report.gold)}</li>
            <li>✨ +{n(report.essence)}</li>
            <li>⚔️ +{n(report.kills)}</li>
          </ul>
          {report.cappedSeconds < report.seconds && (
            <p className="small muted">{t('offline.capped', { hours: Math.round(report.cappedSeconds / 3600) })}</p>
          )}
          <div className="row end">
            <button className="btn primary" autoFocus onClick={() => gameStore.dismissOffline()}>
              {t('offline.collect')}
            </button>
          </div>
        </Modal>
      )}
      <UpdatePrompt />
    </div>
  );
}
