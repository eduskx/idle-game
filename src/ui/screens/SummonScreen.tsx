import { useEffect, useState } from 'react';
import { CREATURES, CREATURE_BY_ID, RARITY_ORDER } from '../../data/creatures';
import { canSummon, RARITY_WEIGHTS, summon, summonCost, summonPool, type SummonResult } from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Currency, Section } from '../components/common';
import { Sprite } from '../components/Sprite';
import { TypeChips } from '../components/TypeChip';
import { chargeMs, FLASH_MS } from '../summonReveal';

export function SummonScreen() {
  const s = useGame();
  const { t } = useT();
  const [results, setResults] = useState<SummonResult[]>([]);
  const [revealing, setRevealing] = useState(false);
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
    const reduced =
      s.settings.reducedMotion || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setRevealing(out.length > 0 && !reduced);
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

      {revealing && <SummonReveal results={results} onDone={() => setRevealing(false)} />}

      {results.length > 0 && !revealing && (
        <ul className="summon-results" aria-live="polite">
          {results.map((r, i) => {
            const def = CREATURE_BY_ID[r.defId]!;
            return (
              <li
                key={i}
                className={`summon-result rarity-${def.rarity}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Sprite id={def.id} size={56} label={t(`creature.${def.id}`)} />
                <span className="small">{t(`creature.${def.id}`)}</span>
                <TypeChips types={def.types} compact />
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
              <Sprite id={c.id} size={44} dim={!owned} label={unlocked ? t(`creature.${c.id}`) : '?'} />
              {unlocked && <TypeChips types={c.types} compact />}
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

type Phase = 'charge' | 'flash' | 'show';

/**
 * Full-screen summoning sequence: the circle charges up, flashes in the rarity color and the
 * creature hops out with its name and types. A ×10 batch reveals one after another; tap
 * advances, "Skip" jumps to the result grid. Not rendered at all with reduced motion.
 */
function SummonReveal({ results, onDone }: { results: SummonResult[]; onDone: () => void }) {
  const { t } = useT();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('charge');
  const multi = results.length > 1;
  const current = results[index]!;
  const def = CREATURE_BY_ID[current.defId]!;

  useEffect(() => {
    if (phase === 'show') return;
    const ms = phase === 'charge' ? chargeMs(def.rarity, multi) : FLASH_MS;
    const timer = window.setTimeout(() => setPhase(phase === 'charge' ? 'flash' : 'show'), ms);
    return () => window.clearTimeout(timer);
  }, [phase, def.rarity, multi]);

  function advance() {
    if (phase !== 'show') {
      setPhase('show');
      return;
    }
    if (index + 1 < results.length) {
      setIndex(index + 1);
      setPhase('charge');
    } else {
      onDone();
    }
  }

  const last = index + 1 >= results.length;
  return (
    <div
      className={`summon-reveal rarity-${def.rarity} phase-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('summon.title')}
      onClick={advance}
    >
      {multi && (
        <span className="reveal-count">
          {index + 1} / {results.length}
        </span>
      )}
      <button
        className="btn reveal-skip"
        onClick={(e) => {
          e.stopPropagation();
          onDone();
        }}
      >
        {multi ? t('summon.skipAll') : t('summon.skip')}
      </button>

      <div className="reveal-stage" aria-hidden={phase !== 'show'}>
        <div className="reveal-circle">
          <div className="reveal-ring" />
          <div className="reveal-ring inner" />
          <div className="reveal-core" />
        </div>
        <div className="reveal-flash" />
        {phase === 'show' && (
          <div key={index} className="reveal-creature">
            <div className="reveal-pop">
              <Sprite id={def.id} size={168} className="breathe" label={t(`creature.${def.id}`)} />
            </div>
          </div>
        )}
      </div>

      <div className="reveal-info-slot" aria-live="polite">
        {phase === 'show' && (
          <div key={`info-${index}`} className="reveal-info">
            <span className="reveal-rarity">{t(`rarity.${def.rarity}`)}</span>
            <strong className="reveal-name">{t(`creature.${def.id}`)}</strong>
            <TypeChips types={def.types} />
            <span className={`tag ${current.isNew ? 'new' : ''}`}>
              {current.isNew ? t('summon.new') : current.starUp ? t('summon.starUp') : t('summon.shard')}
            </span>
            <span className="reveal-hint">{last ? t('summon.tapDone') : t('summon.tapNext')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
