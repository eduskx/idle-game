import { useState } from 'react';
import { CREATURES, CREATURE_BY_ID, RARITY_ORDER } from '../../data/creatures';
import { canSummon, RARITY_WEIGHTS, summon, summonCost, summonPool, type SummonResult } from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Currency, Section } from '../components/common';
import { Sprite } from '../components/Sprite';

export function SummonScreen() {
  const s = useGame();
  const { t } = useT();
  const [results, setResults] = useState<SummonResult[]>([]);
  const pool = summonPool(s);
  const poolIds = new Set(pool.map((c) => c.id));
  const availableRarities = RARITY_ORDER.filter((r) => pool.some((c) => c.rarity === r));
  const totalWeight = availableRarities.reduce((sum, r) => sum + RARITY_WEIGHTS[r], 0);

  function doSummon(count: number) {
    const out = gameStore.dispatch((st) => {
      const list: SummonResult[] = [];
      for (let i = 0; i < count; i++) {
        const r = summon(st);
        if (!r) break;
        list.push(r);
      }
      return list;
    });
    setResults(out);
  }

  return (
    <Section title={t('summon.title')} aside={<Currency kind="essence" amount={s.currencies.essence} />}>
      <p className="muted small">{t('summon.description')}</p>
      <div className="summon-circle" aria-hidden="true">
        <div className="circle-glow" />
      </div>
      <div className="row gap center">
        <button className="btn primary big" disabled={!canSummon(s, 1)} onClick={() => doSummon(1)}>
          {t('summon.one')}
          <small>{t('summon.cost', { cost: summonCost() })}</small>
        </button>
        <button className="btn primary big" disabled={!canSummon(s, 10)} onClick={() => doSummon(10)}>
          {t('summon.ten')}
          <small>{t('summon.cost', { cost: summonCost() * 10 })}</small>
        </button>
      </div>

      {results.length > 0 && (
        <ul className="summon-results" aria-live="polite">
          {results.map((r, i) => {
            const def = CREATURE_BY_ID[r.defId]!;
            return (
              <li
                key={i}
                className={`summon-result rarity-${def.rarity}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Sprite
                  id={def.id}
                  look={def.look}
                  realm={def.realm}
                  size={56}
                  label={t(`creature.${def.id}`)}
                />
                <span className="small">{t(`creature.${def.id}`)}</span>
                <span className={`tag ${r.isNew ? 'new' : ''}`}>
                  {r.isNew ? t('summon.new') : r.starUp ? t('summon.starUp') : t('summon.shard')}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <h3>{t('summon.rates')}</h3>
      <ul className="rates">
        {availableRarities.map((r) => (
          <li key={r} className={`rarity-${r}`}>
            <span>{t(`rarity.${r}`)}</span>
            <span>{((RARITY_WEIGHTS[r] / totalWeight) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>

      <h3>{t('summon.pool')}</h3>
      <p className="muted small">{t('summon.lockedHint')}</p>
      <ul className="pool-grid">
        {CREATURES.map((c) => {
          const unlocked = poolIds.has(c.id);
          const owned = Boolean(s.creatures[c.id]);
          return (
            <li
              key={c.id}
              className={`pool-item rarity-${c.rarity} ${unlocked ? '' : 'locked'}`}
              title={unlocked ? t(`creature.${c.id}`) : t('summon.unlocksAt', { zone: c.unlockZone + 1 })}
            >
              <Sprite
                id={c.id}
                look={c.look}
                realm={c.realm}
                size={44}
                dim={!owned}
                label={unlocked ? t(`creature.${c.id}`) : '?'}
              />
              <span className="tiny">
                {unlocked ? t(`creature.${c.id}`) : t('summon.unlocksAt', { zone: c.unlockZone + 1 })}
              </span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
