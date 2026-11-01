import { UPGRADES } from '../../data/progression';
import { buyUpgradeMax, canBuyUpgrade, upgradeLevelCost } from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Currency, Section } from '../components/common';

const ICONS: Record<string, string> = {
  sharpen: '🗡️',
  vitality: '🍲',
  greed: '👛',
  wisdom: '📜',
  focus: '🎯',
  swiftness: '💨',
  pack: '🐾',
};

export function UpgradesScreen() {
  const s = useGame();
  const { t, n } = useT();
  return (
    <Section title={t('upgrades.title')} aside={<Currency kind="gold" amount={s.currencies.gold} />}>
      <p className="muted small">{t('upgrades.description')}</p>
      <ul className="card-list">
        {UPGRADES.map((u) => {
          const level = s.upgrades[u.id];
          const maxed = level >= u.maxLevel;
          const cost = upgradeLevelCost(s, u.id);
          const affordable = canBuyUpgrade(s, u.id);
          return (
            <li key={u.id} className="card upgrade-card">
              <div className="upgrade-icon" aria-hidden="true">
                {ICONS[u.id]}
              </div>
              <div className="card-body">
                <div className="row between">
                  <strong>{t(`upgrade.${u.id}.name`)}</strong>
                  <span className="pill">{maxed ? t('upgrades.max') : t('upgrades.level', { level })}</span>
                </div>
                <p className="small muted">{t(`upgrade.${u.id}.desc`)}</p>
                {!maxed && (
                  <div className="row gap">
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
