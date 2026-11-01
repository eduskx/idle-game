import type { CSSProperties } from 'react';
import { UPGRADES } from '../../data/progression';
import { buyUpgradeMax, canBuyUpgrade, upgradeLevelCost } from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Currency, Section } from '../components/common';
import { UpgradeIcon } from '../components/UpgradeIcon';
import { MILESTONE_EVERY, upgradeView, type UpgradeView } from '../upgradeView';

/** Accent per upgrade, so the list reads by color: attack red, life green, gold, XP blue … */
const ACCENTS: Record<string, string> = {
  sharpen: '#ef6a6a',
  vitality: '#6fdc8c',
  greed: '#f5c26b',
  wisdom: '#7cc4ff',
  focus: '#ff9a4c',
  swiftness: '#9fe3ff',
  pack: '#b79cff',
};

export function UpgradesScreen() {
  const s = useGame();
  const { t, n, lang } = useT();

  const fmt = (v: UpgradeView['now'], format: UpgradeView['format']) => {
    if (format === 'mult') {
      const num =
        v < 1000 ? v.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n(v);
      return `×${num}`;
    }
    return format === 'pct' ? `+${v}%` : `+${v}`;
  };

  return (
    <Section title={t('upgrades.title')} aside={<Currency kind="gold" amount={s.currencies.gold} />}>
      <p className="muted small">{t('upgrades.description')}</p>
      <ul className="card-list">
        {UPGRADES.map((u) => {
          const level = s.upgrades[u.id];
          const maxed = level >= u.maxLevel;
          const cost = upgradeLevelCost(s, u.id);
          const affordable = canBuyUpgrade(s, u.id);
          const view = upgradeView(u.id, level);
          const ms = view.milestone;
          return (
            <li
              key={u.id}
              className={`card upgrade-card ${maxed ? 'maxed' : ''}`}
              style={{ '--up': ACCENTS[u.id] ?? 'var(--accent)' } as CSSProperties}
            >
              <div className="upgrade-icon">
                <UpgradeIcon id={u.id} />
              </div>
              <div className="card-body">
                <div className="row between">
                  <strong className="upgrade-name">{t(`upgrade.${u.id}.name`)}</strong>
                  <span className="pill">{maxed ? t('upgrades.max') : t('upgrades.level', { level })}</span>
                </div>
                <p className="small muted upgrade-desc">{t(`upgrade.${u.id}.desc`)}</p>
                <div className="upgrade-effect">
                  <span className="ue-label">{t(`upgrades.effect.${view.effect}`)}</span>
                  <span className="ue-now">{fmt(view.now, view.format)}</span>
                  {!maxed && (
                    <>
                      <span className="ue-arrow" aria-label={t('upgrades.then')}>
                        →
                      </span>
                      <span className="ue-next">{fmt(view.next, view.format)}</span>
                    </>
                  )}
                </div>
                {ms && (
                  <div className={`upgrade-milestone ${ms.left === 1 ? 'soon' : ''}`}>
                    <div
                      className="um-track"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={MILESTONE_EVERY}
                      aria-valuenow={ms.into}
                      aria-label={t('upgrades.nextDouble', { level: ms.at })}
                    >
                      <div className="um-fill" style={{ width: `${(ms.into / MILESTONE_EVERY) * 100}%` }} />
                    </div>
                    <span className="um-text">
                      {ms.left === 1
                        ? t('upgrades.doubleNext')
                        : `${t('upgrades.nextDouble', { level: ms.at })} · ${t('upgrades.toGo', { count: ms.left })}`}
                    </span>
                  </div>
                )}
                {!maxed && (
                  <div className="row gap upgrade-buy">
                    <button
                      className="btn primary"
                      disabled={!affordable}
                      onClick={() => gameStore.dispatch((st) => buyUpgradeMax(st, u.id, 1))}
                    >
                      {t('upgrades.buy')} · 🪙 {n(cost)}
                    </button>
                    <button
                      className="btn ghost"
                      disabled={!affordable}
                      onClick={() => gameStore.dispatch((st) => buyUpgradeMax(st, u.id))}
                    >
                      {t('upgrades.buyMax')}
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
