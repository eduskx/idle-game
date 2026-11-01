import { useState } from 'react';
import { TALENTS } from '../../data/progression';
import {
  BALANCE,
  buyTalent,
  canBuyTalent,
  canRebloom,
  isTalentUnlocked,
  rebloom,
  rebloomReward,
  talentCost,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { ConfirmDialog, Currency, Section } from '../components/common';

export function RebloomScreen() {
  const s = useGame();
  const { t, n } = useT();
  const [confirming, setConfirming] = useState(false);
  const reward = rebloomReward(s);

  return (
    <>
      <Section title={t('rebloom.title')} aside={<Currency kind="seeds" amount={s.currencies.seeds} />}>
        <p className="small">{t('rebloom.description')}</p>
        {canRebloom(s) ? (
          <button className="btn rebloom big" onClick={() => setConfirming(true)}>
            🌸 {t('rebloom.reward', { seeds: n(reward) })}
          </button>
        ) : (
          <p className="notice">{t('rebloom.locked', { stage: BALANCE.rebloomMinStage })}</p>
        )}
      </Section>

      <Section title={t('rebloom.talents')}>
        <ul className="card-list talents">
          {TALENTS.map((tal) => {
            const level = s.talents[tal.id];
            const unlocked = isTalentUnlocked(s, tal.id);
            const maxed = level >= tal.maxLevel;
            return (
              <li key={tal.id} className={`card talent-card ${unlocked ? '' : 'locked'}`}>
                <div className="card-body">
                  <div className="row between">
                    <strong>{t(`talent.${tal.id}.name`)}</strong>
                    <span className="pill">
                      {level}/{tal.maxLevel}
                    </span>
                  </div>
                  <p className="small muted">{t(`talent.${tal.id}.desc`)}</p>
                  {!unlocked && tal.requires ? (
                    <p className="small">
                      🔒 {t('rebloom.requires', { talent: t(`talent.${tal.requires}.name`) })}
                    </p>
                  ) : (
                    !maxed && (
                      <button
                        className="btn primary"
                        disabled={!canBuyTalent(s, tal.id)}
                        onClick={() => gameStore.dispatch((st) => buyTalent(st, tal.id))}
                      >
                        🌱 {t('rebloom.cost', { cost: n(talentCost(s, tal.id)) })}
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {confirming && (
        <ConfirmDialog
          text={t('rebloom.confirm', { seeds: n(reward) })}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            gameStore.dispatch(rebloom);
            void gameStore.save();
            setConfirming(false);
          }}
        />
      )}
    </>
  );
}
