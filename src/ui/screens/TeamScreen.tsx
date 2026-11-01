import { useState } from 'react';
import { CREATURE_BY_ID, RARITY_ORDER } from '../../data/creatures';
import { getZone } from '../../data/world';
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
  zoneEnemyTypes,
  zoneMatchup,
  zoneOf,
  type Realm,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { ProgressBar, Section } from '../components/common';
import { CharmsPanel, ExpeditionsPanel } from './ExpeditionsPanel';
import { Sprite } from '../components/Sprite';
import { TypeChips } from '../components/TypeChip';

type Filter = 'all' | Realm;
export type View = 'creatures' | 'expeditions' | 'charms';

function abilityPercent(kind: string, value: number): number | string {
  return kind === 'thorns' ? (value * 3).toFixed(1) : Math.round(value * 100);
}

export function TeamScreen({ initialView = 'creatures' }: { initialView?: View }) {
  const s = useGame();
  const { t, n } = useT();
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>(initialView);
  const mods = globalModifiers(s);
  const zoneIndex = zoneOf(s.battle.stage);
  const zone = getZone(zoneIndex);
  const foeTypes = zoneEnemyTypes(zoneIndex);
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
          <div className="zone-foes">
            <span className="small">{t('team.zoneFoes', { zone: t(`zone.${zone.id}`) })}</span>
            <TypeChips types={foeTypes} compact />
          </div>
          <ul className="card-list">
            {owned.map((c) => {
              const def = CREATURE_BY_ID[c.defId]!;
              const stats = memberStats(s, c.defId, mods);
              const pos = s.team.indexOf(c.defId);
              const inTeam = pos >= 0;
              const away = s.expeditions.some((e) => e.defId === c.defId);
              const cap = levelCap(c.stars);
              const matchup = zoneMatchup(def.types, zoneIndex);
              const needShards = c.stars < MAX_STARS ? STAR_SHARDS[c.stars]! : 0;
              return (
                <li
                  key={c.defId}
                  className={`card creature-card rarity-${def.rarity} realm-${def.realm} ${inTeam ? 'in-team' : ''}`}
                >
                  <div className={`cc-portrait type-${def.types[0]}`}>
                    <div className={`cc-portrait-bg type-${def.types[1] ?? def.types[0]}`}>
                      <Sprite id={def.id} size={84} label={t(`creature.${def.id}`)} />
                    </div>
                    {pos === 0 && <span className="badge">{t('team.front')}</span>}
                  </div>
                  <div className="cc-head">
                    <div className="row between">
                      <strong className="cc-name">{t(`creature.${def.id}`)}</strong>
                      <span className="stars" aria-label={t('team.stars', { stars: c.stars })}>
                        {'★'.repeat(c.stars)}
                        <span className="muted">{'★'.repeat(MAX_STARS - c.stars)}</span>
                      </span>
                    </div>
                    <div className="cc-meta small">
                      <span className="rarity">{t(`rarity.${def.rarity}`)}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`cc-realm realm-${def.realm}`}>{t(`realm.${def.realm}`)}</span>
                    </div>
                    <TypeChips types={def.types} />
                    {matchup !== 'neutral' && (
                      <div className={`matchup matchup-${matchup}`}>
                        {t(matchup === 'strong' ? 'team.matchStrong' : 'team.matchWeak')}
                      </div>
                    )}
                  </div>
                  <div className="cc-body">
                    <div className="cc-level small">
                      <span>{t('team.level', { level: c.level, cap })}</span>
                      <ProgressBar
                        value={c.level >= cap ? 1 : c.xp}
                        max={c.level >= cap ? 1 : xpToNextLevel(c.level)}
                        tone="xp"
                        label="XP"
                      />
                    </div>
                    <div className="cc-stats">
                      <span>
                        <small>{t('team.atk')}</small>
                        <b>{n(stats.atk)}</b>
                      </span>
                      <span>
                        <small>{t('team.hp')}</small>
                        <b>{n(stats.maxHp)}</b>
                      </span>
                      <span>
                        <small>{t('team.speed')}</small>
                        <b>{stats.speed.toFixed(2)}</b>
                      </span>
                    </div>
                    <p className="small ability">
                      {t(`ability.${def.ability.kind}`, {
                        value: abilityPercent(def.ability.kind, stats.abilityValue),
                      })}
                    </p>
                    {c.stars < MAX_STARS && (
                      <div className="tiny muted">
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
