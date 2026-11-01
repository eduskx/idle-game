import { useEffect, useState } from 'react';
import { CHARM_BY_ID } from '../../data/charms';
import { CREATURE_BY_ID } from '../../data/creatures';
import { EXPEDITION_DURATIONS, EXPEDITION_SLOTS, EXPEDITION_UNLOCK_STAGE } from '../../data/expeditions';
import {
  claimExpedition,
  expeditionRemaining,
  expeditionReward,
  expeditionsUnlocked,
  isOnExpedition,
  recallExpedition,
  startExpedition,
  type Expedition,
} from '../../engine';
import { formatDuration } from '../../i18n';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Section } from '../components/common';
import { Sprite } from '../components/Sprite';

export function ExpeditionsPanel() {
  const s = useGame();
  const { t, n } = useT();
  const [pick, setPick] = useState<string>('');
  const [duration, setDuration] = useState<Expedition['durationId']>('medium');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!expeditionsUnlocked(s)) {
    return (
      <Section title={t('expedition.title')}>
        <p className="notice">🔒 {t('expedition.locked', { stage: EXPEDITION_UNLOCK_STAGE })}</p>
      </Section>
    );
  }

  const free = Object.keys(s.creatures).filter((id) => !s.team.includes(id) && !isOnExpedition(s, id));
  const selected = free.includes(pick) ? pick : free[0];
  const preview = selected ? expeditionReward(s, selected, duration) : null;
  const full = s.expeditions.length >= EXPEDITION_SLOTS;

  function claim(index: number) {
    const r = gameStore.dispatch((st) => claimExpedition(st, index));
    if (!r) return;
    gameStore.toast(t('expedition.result', { gold: n(r.gold), essence: n(r.essence) }), 'success');
    if (r.charm) gameStore.toast(t('charm.found', { name: t(`charm.${r.charm}.name`) }), 'success');
  }

  return (
    <Section
      title={t('expedition.title')}
      aside={
        <span className="pill">
          {t('expedition.slots', { used: s.expeditions.length, max: EXPEDITION_SLOTS })}
        </span>
      }
    >
      <p className="small muted">{t('expedition.description')}</p>

      {s.expeditions.length > 0 && (
        <ul className="card-list">
          {s.expeditions.map((e, i) => {
            const def = CREATURE_BY_ID[e.defId]!;
            const left = expeditionRemaining(e, now);
            return (
              <li key={e.defId} className="card expedition">
                <Sprite
                  id={def.id}
                  look={def.look}
                  realm={def.realm}
                  size={48}
                  label={t(`creature.${def.id}`)}
                />
                <div className="card-body">
                  <strong>{t(`creature.${def.id}`)}</strong>
                  <span className="small muted">
                    {t(`expedition.${e.durationId}`)} ·{' '}
                    {left > 0
                      ? t('expedition.remaining', { time: formatDuration(left) })
                      : t('expedition.ready')}
                  </span>
                </div>
                {left > 0 ? (
                  <button
                    className="btn ghost"
                    onClick={() => gameStore.dispatch((st) => recallExpedition(st, i))}
                  >
                    {t('expedition.recall')}
                  </button>
                ) : (
                  <button className="btn primary" onClick={() => claim(i)}>
                    {t('expedition.claim')}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!full &&
        (free.length === 0 ? (
          <p className="small muted">{t('expedition.none')}</p>
        ) : (
          <div className="expedition-form">
            <label className="setting">
              <span>{t('expedition.pick')}</span>
              <select value={selected} onChange={(e) => setPick(e.target.value)}>
                {free.map((id) => (
                  <option key={id} value={id}>
                    {t(`creature.${id}`)} ({t(`rarity.${CREATURE_BY_ID[id]!.rarity}`)},{' '}
                    {s.creatures[id]!.stars}★)
                  </option>
                ))}
              </select>
            </label>
            <div className="tabs" role="radiogroup">
              {EXPEDITION_DURATIONS.map((d) => (
                <button
                  key={d.id}
                  role="radio"
                  aria-checked={duration === d.id}
                  className={`tab ${duration === d.id ? 'active' : ''}`}
                  onClick={() => setDuration(d.id)}
                >
                  {t(`expedition.${d.id}`)}
                </button>
              ))}
            </div>
            {preview && (
              <p className="small">
                {t('expedition.reward', {
                  gold: n(preview.gold),
                  essence: n(preview.essence),
                  chance: Math.round(preview.charmChance * 100),
                })}
              </p>
            )}
            <button
              className="btn primary"
              disabled={!selected}
              onClick={() => selected && gameStore.dispatch((st) => startExpedition(st, selected, duration))}
            >
              {t('expedition.send')}
            </button>
          </div>
        ))}
    </Section>
  );
}

export function CharmsPanel() {
  const s = useGame();
  const { t } = useT();
  const owned = Object.entries(s.charms).filter(([, lvl]) => lvl > 0);
  return (
    <Section title={t('charm.title')}>
      <p className="small muted">{t('charm.hint')}</p>
      {owned.length === 0 ? (
        <p className="small">{t('charm.empty')}</p>
      ) : (
        <ul className="charms">
          {owned.map(([id, lvl]) => {
            const def = CHARM_BY_ID[id as keyof typeof CHARM_BY_ID];
            return (
              <li key={id} title={t(`charm.${id}.desc`)}>
                <span className="charm-icon" aria-hidden="true">
                  {def.icon}
                </span>
                <span>
                  <strong>{t(`charm.${id}.name`)}</strong> <span className="pill">{lvl}</span>
                  <br />
                  <span className="tiny muted">{t(`charm.${id}.desc`)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
