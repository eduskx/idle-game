import { lazy, Suspense, useEffect, useState } from 'react';
import { getZone } from '../data/world';
import { expeditionRemaining, zoneOf } from '../engine';
import { formatDuration } from '../i18n';
import { useT } from '../i18n/useT';
import { gameStore, useGame, useUi } from '../store/gameStore';
import { Currency, Modal } from './components/common';
import { UpdatePrompt } from './components/UpdatePrompt';
import { NAV_TABS, parseStoredTab, ROUTE_PARENT, TAB_KEY, type NavTab, type Route } from './navigation';
import { HomeScreen } from './screens/HomeScreen';

// Secondary screens are split into their own chunks so the first paint stays small.
const BattleScreen = lazy(() => import('./screens/BattleScreen').then((m) => ({ default: m.BattleScreen })));
const TeamScreen = lazy(() => import('./screens/TeamScreen').then((m) => ({ default: m.TeamScreen })));
const SummonScreen = lazy(() => import('./screens/SummonScreen').then((m) => ({ default: m.SummonScreen })));
const UpgradesScreen = lazy(() =>
  import('./screens/UpgradesScreen').then((m) => ({ default: m.UpgradesScreen })),
);
const RebloomScreen = lazy(() =>
  import('./screens/RebloomScreen').then((m) => ({ default: m.RebloomScreen })),
);
const MoreScreen = lazy(() => import('./screens/MoreScreen').then((m) => ({ default: m.MoreScreen })));

const NAV_ICONS: Record<NavTab, string> = {
  home: '🏡',
  team: '🐾',
  summon: '🔮',
  upgrades: '⬆️',
  more: '☰',
};

function readTab(): NavTab {
  try {
    return parseStoredTab(localStorage.getItem(TAB_KEY));
  } catch {
    return 'home';
  }
}

export function App() {
  const s = useGame();
  const ui = useUi();
  const { t, n, lang } = useT();
  const [route, setRoute] = useState<Route>(readTab);
  const tab = ROUTE_PARENT[route];
  const realm = getZone(zoneOf(s.battle.stage)).realm;

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, tab);
    } catch {
      /* ignore */
    }
  }, [tab]);

  useEffect(() => {
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0 });
  }, [route]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.realm = realm;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', realm === 'hearth' ? '#fff3e2' : '#14121f');
    document.documentElement.dataset.motion = s.settings.reducedMotion ? 'reduced' : 'full';
  }, [lang, realm, s.settings.reducedMotion]);

  useEffect(() => {
    if (ui.newAchievements.length === 0) return;
    for (const id of gameStore.consumeAchievements()) {
      gameStore.toast(`🏆 ${t(`achievement.${id}`)}`, 'success');
    }
  }, [ui.newAchievements, t]);

  const report = ui.offlineReport;
  const expeditionReady = s.expeditions.some((e) => expeditionRemaining(e) <= 0);

  return (
    <div className={`app realm-bg-${realm}`}>
      <header className="topbar">
        <h1 className="logo">{t('app.title')}</h1>
        <div className="currencies">
          <Currency kind="gold" amount={s.currencies.gold} />
          <Currency kind="essence" amount={s.currencies.essence} />
          {(s.currencies.seeds > 0 || s.lifetime.reblooms > 0) && (
            <Currency kind="seeds" amount={s.currencies.seeds} />
          )}
        </div>
      </header>

      <main className="content" id="main">
        {(route === 'battle' || route === 'rebloom' || route === 'expeditions') && (
          <button className="btn ghost back-btn" onClick={() => setRoute(tab)}>
            <span aria-hidden="true">‹</span> {t(`nav.${tab}`)}
          </button>
        )}
        <Suspense fallback={<p className="muted center">…</p>}>
          {route === 'home' && <HomeScreen onOpen={setRoute} />}
          {route === 'battle' && <BattleScreen />}
          {route === 'team' && <TeamScreen />}
          {route === 'expeditions' && <TeamScreen initialView="expeditions" />}
          {route === 'summon' && <SummonScreen />}
          {route === 'upgrades' && <UpgradesScreen />}
          {route === 'rebloom' && <RebloomScreen />}
          {route === 'more' && <MoreScreen />}
        </Suspense>
      </main>

      <nav className="bottom-nav" aria-label="Main">
        {NAV_TABS.map((id) => (
          <button
            key={id}
            className={`nav-btn ${tab === id ? 'active' : ''}`}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => setRoute(id)}
          >
            <span className="nav-icon" aria-hidden="true">
              {NAV_ICONS[id]}
            </span>
            {id === 'team' && expeditionReady && route !== 'expeditions' && <span className="dot nav-dot" />}
            <span className="nav-label">{t(`nav.${id}`)}</span>
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
            <p className="small muted">
              {t('offline.capped', { hours: Math.round(report.cappedSeconds / 3600) })}
            </p>
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
