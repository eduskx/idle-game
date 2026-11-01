import { useState } from 'react';
import { CREATURE_BY_ID, RARITY_ORDER } from '../../data/creatures';
import {
  globalModifiers,
  levelCap,
  MAX_STARS,
  memberStats,
  moveTeamMember,
  expeditionRemaining,
  STAR_SHARDS,
  toggleTeamMember,
  xpToNextLevel,
  type Realm,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { ProgressBar, Section } from '../components/common';
import { CharmsPanel, ExpeditionsPanel } from './ExpeditionsPanel';
import { Sprite } from '../components/Sprite';

type Filter = 'all' | Realm;
type View = 'creatures' | 'expeditions' | 'charms';

function abilityPercent(kind: string, value: number): number | string {
  return kind === 'thorns' ? (value * 3).toFixed(1) : Math.round(value * 100);
}

export function TeamScreen() {
  const s = useGame();
  const { t, n } = useT();
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>('creatures');
  const mods = globalModifiers(s);
  const readyCount = s.expeditions.filter((e) => expeditionRemaining(e) <= 0).length;

  const owned = Object.values(s.creatures)
    .filter((c) => filter === 'all' || CREATURE_BY_ID[c.defId]?.realm === filter)
    .sort((a, b) => {
      const ta = s.team.indexOf(a.defId);
      const tb = s.team.indexOf(b.defId);
      if (ta !== tb) return (ta < 0 ? 99 : ta) - (tb < 0 ? 99 : tb);
      const ra = RARITY_ORDER.indexOf(CREATURE_BY_ID[a.defId]!.rarity);
      const rb = RARITY_ORDER.indexOf(CREATURE_BY_ID[b.defId]!.rarity);
      return rb - ra || b.level - a.level;
    });

  return (
    <>
      <div className="tabs view-tabs" role="tablist">
        {(['creatures', 'expeditions', 'charms'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            className={`tab ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v === 'creatures'
              ? t('team.title')
              : v === 'expeditions'
                ? t('expedition.title')
                : t('charm.title')}
            {v === 'expeditions' && readyCount > 0 && <span className="dot" aria-label="ready" />}
          </button>
        ))}
      </div>
      {view === 'creatures' && (
        <Section
          title={t('team.title')}
          aside={
            <span className="pill">{t('team.slots', { count: s.team.length, slots: mods.teamSlots })}</span>
          }
        >
          <p className="muted small">{t('team.hint')}</p>
          <div className="tabs" role="tablist">
            {(['all', 'hearth', 'umbra'] as const).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={`tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? t('team.filterAll') : t(`realm.${f}`)}
              </button>
            ))}
          </div>
          <ul className="card-list">
            {owned.map((c) => {
              const def = CREATURE_BY_ID[c.defId]!;
              const stats = memberStats(s, c.defId, mods);
              const pos = s.team.indexOf(c.defId);
              const inTeam = pos >= 0;
              const away = s.expeditions.some((e) => e.defId === c.defId);
              const cap = levelCap(c.stars);
              const needShards = c.stars < MAX_STARS ? STAR_SHARDS[c.stars]! : 0;
              return (
                <li
                  key={c.defId}
                  className={`card creature-card rarity-${def.rarity} realm-${def.realm} ${inTeam ? 'in-team' : ''}`}
                >
                  <div className="card-art">
                    <Sprite
                      id={def.id}
                      look={def.look}
                      realm={def.realm}
                      size={64}
                      label={t(`creature.${def.id}`)}
                    />
                    {pos === 0 && <span className="badge">{t('team.front')}</span>}
                  </div>
                  <div className="card-body">
                    <div className="row between">
                      <strong>{t(`creature.${def.id}`)}</strong>
                      <span className="stars" aria-label={t('team.stars', { stars: c.stars })}>
                        {'★'.repeat(c.stars)}
                        <span className="muted">{'★'.repeat(MAX_STARS - c.stars)}</span>
                      </span>
                    </div>
                    <div className="tags">
                      <span className={`tag rarity rarity-${def.rarity}`}>{t(`rarity.${def.rarity}`)}</span>
                      <span className={`tag realm-${def.realm}`}>{t(`realm.${def.realm}`)}</span>
                      <span className={`tag element-${def.element}`}>{t(`element.${def.element}`)}</span>
                    </div>
                    <div className="small">
                      {t('team.level', { level: c.level, cap })}
                      <ProgressBar
                        value={c.level >= cap ? 1 : c.xp}
                        max={c.level >= cap ? 1 : xpToNextLevel(c.level)}
                        tone="xp"
                        label="XP"
                      />
                    </div>
                    <div className="stat-row small">
                      <span>
                        {t('team.atk')} {n(stats.atk)}
                      </span>
                      <span>
                        {t('team.hp')} {n(stats.maxHp)}
                      </span>
                      <span>
                        {t('team.speed')} {stats.speed.toFixed(2)}
                      </span>
                    </div>
                    <p className="small ability">
                      {t(`ability.${def.ability.kind}`, {
                        value: abilityPercent(def.ability.kind, stats.abilityValue),
                      })}
                    </p>
                    {c.stars < MAX_STARS && (
                      <div className="small muted">
                        {t('team.shards', { shards: c.shards, needed: needShards })}
                      </div>
                    )}
                    <div className="row gap">
                      <button
                        className={`btn ${inTeam ? 'ghost' : 'primary'}`}
                        disabled={away || (!inTeam && s.team.length >= mods.teamSlots)}
                        onClick={() => gameStore.dispatch((st) => toggleTeamMember(st, c.defId))}
                      >
                        {away ? t('expedition.away') : inTeam ? t('team.remove') : t('team.add')}
                      </button>
                      {inTeam && (
                        <>
                          <button
                            className="btn icon"
                            aria-label={t('team.moveUp')}
                            disabled={pos === 0}
                            onClick={() => gameStore.dispatch((st) => moveTeamMember(st, c.defId, -1))}
                          >
                            ↑
                          </button>
                          <button
                            className="btn icon"
                            aria-label={t('team.moveDown')}
                            disabled={pos === s.team.length - 1}
                            onClick={() => gameStore.dispatch((st) => moveTeamMember(st, c.defId, 1))}
                          >
                            ↓
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
      {view === 'expeditions' && <ExpeditionsPanel />}
      {view === 'charms' && <CharmsPanel />}
    </>
  );
}
