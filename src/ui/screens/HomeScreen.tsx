import { useEffect, useState, type CSSProperties } from 'react';
import { EXPEDITION_SLOTS, EXPEDITION_UNLOCK_STAGE } from '../../data/expeditions';
import { getZone } from '../../data/world';
import {
  BALANCE,
  BOSS_EVERY,
  canRebloom,
  expeditionRemaining,
  expeditionsUnlocked,
  isBossStage,
  rebloomReward,
  stageInZone,
  STAGES_PER_ZONE,
  zoneOf,
} from '../../engine';
import { formatDuration } from '../../i18n';
import { useT } from '../../i18n/useT';
import { useGame } from '../../store/gameStore';
import { Backdrop } from '../components/Backdrop';
import { ProgressBar } from '../components/common';
import { Sprite } from '../components/Sprite';

export type HubTarget = 'battle' | 'expeditions' | 'rebloom';

/**
 * Where each team member stands in the hub scene: the leader up front in the middle,
 * the rest staggered behind it (higher = further away = smaller).
 */
const SLOTS: { x: number; y: number; size: number; z: number }[] = [
  { x: 50, y: 12, size: 136, z: 5 },
  { x: 21, y: 68, size: 108, z: 4 },
  { x: 79, y: 68, size: 108, z: 4 },
  { x: 33, y: 138, size: 80, z: 3 },
  { x: 67, y: 138, size: 80, z: 3 },
];

/** Placeholder for the future player avatar (paper-doll with unlockable outfits). */
function AvatarSlot() {
  const { t } = useT();
  return (
    <div className="avatar-slot" role="img" aria-label={t('home.avatarSoon')}>
      <svg viewBox="0 0 48 64" aria-hidden="true">
        <circle cx="24" cy="18" r="11" />
        <path d="M5 60 C5 42 13 34 24 34 C35 34 43 42 43 60 Z" />
      </svg>
      <span>{t('home.avatarSoon')}</span>
    </div>
  );
}

function Chevron() {
  return (
    <svg className="hub-chev" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3 L11 8 L6 13" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function HomeScreen({ onOpen }: { onOpen: (target: HubTarget) => void }) {
  const s = useGame();
  const { t, n } = useT();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const stage = s.battle.stage;
  const zone = getZone(zoneOf(stage));
  const inZone = stageInZone(stage);
  const nextBoss = Math.ceil(stage / BOSS_EVERY) * BOSS_EVERY;
  const sceneStyle = { '--sky-top': zone.palette[0], '--sky-bottom': zone.palette[1] } as CSSProperties;
  const team = s.team.slice(0, SLOTS.length);

  // Expeditions
  const expUnlocked = expeditionsUnlocked(s);
  const away = s.expeditions.length;
  const ready = s.expeditions.filter((e) => expeditionRemaining(e, now) <= 0).length;
  const soonest = s.expeditions.reduce(
    (min, e) => Math.min(min, expeditionRemaining(e, now)),
    Number.POSITIVE_INFINITY,
  );

  // Rebloom
  const rebloomReady = canRebloom(s);
  const rebloomKnown = s.lifetime.reblooms > 0 || s.currencies.seeds > 0;

  return (
    <div className="home">
      <div className={`hub-scene stage realm-${zone.realm}`} style={sceneStyle}>
        <div className="stage-sky" />
        <Backdrop realm={zone.realm} />
        <div className="stage-floor" />
        <div className="hub-zone">
          <strong>{t(`zone.${zone.id}`)}</strong>
          <span>{t(`realm.${zone.realm}`)}</span>
        </div>
        {team.map((id, i) => {
          const slot = SLOTS[i]!;
          return (
            <div
              key={id}
              className={`hub-member depth-${i === 0 ? 'front' : i < 3 ? 'mid' : 'back'}`}
              style={
                {
                  left: `${slot.x}%`,
                  bottom: slot.y,
                  zIndex: slot.z,
                  '--delay': `${-i * 0.7}s`,
                } as CSSProperties
              }
            >
              <div className="hub-shadow" />
              <Sprite
                id={id}
                size={slot.size}
                scale="stage"
                label={t(`creature.${id}`)}
                className={`breathe hub-idle ${i === 0 ? 'leader' : ''}`}
              />
            </div>
          );
        })}
        <AvatarSlot />
      </div>

      <button className="btn hub-cta" onClick={() => onOpen('battle')}>
        <span className="hub-cta-icon" aria-hidden="true">
          ⚔️
        </span>
        <span className="hub-cta-text">
          <strong>{t('home.continue')}</strong>
          <small>
            {t('battle.stage', { stage })} · {t(`zone.${zone.id}`)}
            {isBossStage(stage) ? ` · ${t('battle.boss')}` : ''}
          </small>
        </span>
      </button>

      <ul className="hub-cards">
        <li>
          <button className="hub-card" onClick={() => onOpen('battle')}>
            <span className="hub-card-icon" aria-hidden="true">
              🗺️
            </span>
            <span className="hub-card-body">
              <strong>{t('home.zoneProgress')}</strong>
              <span className="small muted">
                {inZone}/{STAGES_PER_ZONE} ·{' '}
                {isBossStage(stage) ? t('home.bossNow') : t('home.bossIn', { count: nextBoss - stage })}
              </span>
              <ProgressBar value={inZone} max={STAGES_PER_ZONE} tone="xp" label={t('home.zoneProgress')} />
            </span>
            <Chevron />
          </button>
        </li>

        <li>
          {expUnlocked ? (
            <button className={`hub-card ${ready > 0 ? 'ready' : ''}`} onClick={() => onOpen('expeditions')}>
              <span className="hub-card-icon" aria-hidden="true">
                🧭
              </span>
              <span className="hub-card-body">
                <strong>
                  {t('expedition.title')}
                  {ready > 0 && <span className="dot" aria-hidden="true" />}
                </strong>
                <span className="small muted">
                  {away === 0
                    ? t('home.expeditionsIdle')
                    : ready > 0
                      ? t('home.expeditionsReady', { count: ready })
                      : t('home.expeditionsAway', {
                          used: away,
                          max: EXPEDITION_SLOTS,
                          time: formatDuration(soonest),
                        })}
                </span>
              </span>
              <Chevron />
            </button>
          ) : (
            <div className="hub-card locked" aria-disabled="true">
              <span className="hub-card-icon" aria-hidden="true">
                🔒
              </span>
              <span className="hub-card-body">
                <strong>{t('expedition.title')}</strong>
                <span className="small muted">{t('home.unlockAt', { stage: EXPEDITION_UNLOCK_STAGE })}</span>
                <ProgressBar value={s.lifetime.highestStage} max={EXPEDITION_UNLOCK_STAGE} tone="xp" />
              </span>
            </div>
          )}
        </li>

        <li>
          {rebloomReady || rebloomKnown ? (
            <button className={`hub-card ${rebloomReady ? 'ready' : ''}`} onClick={() => onOpen('rebloom')}>
              <span className="hub-card-icon" aria-hidden="true">
                🌸
              </span>
              <span className="hub-card-body">
                <strong>{t('rebloom.title')}</strong>
                <span className="small muted">
                  {rebloomReady
                    ? t('home.rebloomReady', { seeds: n(rebloomReward(s)) })
                    : t('home.rebloomTalents', { seeds: n(s.currencies.seeds) })}
                </span>
              </span>
              <Chevron />
            </button>
          ) : (
            <div className="hub-card locked" aria-disabled="true">
              <span className="hub-card-icon" aria-hidden="true">
                🔒
              </span>
              <span className="hub-card-body">
                <strong>{t('rebloom.title')}</strong>
                <span className="small muted">{t('home.unlockAt', { stage: BALANCE.rebloomMinStage })}</span>
                <ProgressBar value={s.runHighestStage} max={BALANCE.rebloomMinStage} tone="xp" />
              </span>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}
