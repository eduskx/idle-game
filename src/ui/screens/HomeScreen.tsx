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
import { ZoneBanner } from '../components/ZoneBanner';
import { ZoneScenery } from '../components/ZoneScenery';
import { ProgressBar } from '../components/common';
import { Sprite } from '../components/Sprite';
import { Avatar } from '../avatar/Avatar';
import { hubLayout } from '../hubLayout';

export type HubTarget = 'battle' | 'expeditions' | 'rebloom' | 'wardrobe';

/** The player's avatar standing in the scene; opens the wardrobe. */
function HubAvatar({ onOpen }: { onOpen: () => void }) {
  const s = useGame();
  const { t } = useT();
  return (
    <button className="hub-avatar" onClick={onOpen} aria-label={t('avatar.edit')}>
      <Avatar avatar={s.avatar} className="breathe-av" />
      <span className="hub-avatar-tag" aria-hidden="true">
        👕 {t('home.avatarHint')}
      </span>
    </button>
  );
}

/**
 * How each species reacts when tapped in the hub, matching its personality
 * (docs/CREATURE_BIBLE.md): animation name and a little emote.
 */
const REACTIONS: Record<string, { anim: string; emote: string }> = {
  mossling: { anim: 'hide', emote: '!' },
  emberpup: { anim: 'hop', emote: '★' },
  puddlefin: { anim: 'tilt', emote: '?' },
  teacup: { anim: 'doze', emote: 'z' },
  honeybear: { anim: 'squish', emote: '♥' },
  gloomwisp: { anim: 'droop', emote: '…' },
  bonecrow: { anim: 'cock', emote: '♪' },
  hexcat: { anim: 'snub', emote: '~' },
  drownedknight: { anim: 'clank', emote: '!' },
  eclipsewyrm: { anim: 'rear', emote: '‼' },
};

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
  const [reaction, setReaction] = useState<{ id: string; n: number } | null>(null);
  useEffect(() => {
    if (!reaction) return;
    const id = setTimeout(() => setReaction(null), 1200);
    return () => clearTimeout(id);
  }, [reaction]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const stage = s.battle.stage;
  const zone = getZone(zoneOf(stage));
  const inZone = stageInZone(stage);
  const nextBoss = Math.ceil(stage / BOSS_EVERY) * BOSS_EVERY;
  const sceneStyle = { '--sky-top': zone.palette[0], '--sky-bottom': zone.palette[1] } as CSSProperties;
  const placements = hubLayout(s.team);

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
      <div className={`hub-scene stage realm-${zone.realm} zone-${zone.id}`} style={sceneStyle}>
        <div className="stage-sky" />
        <ZoneScenery zoneId={zone.id} />
        <ZoneBanner zoneIndex={zoneOf(stage)} />
        <div className="hub-zone">
          <strong>{t(`zone.${zone.id}`)}</strong>
          <span>{t(`realm.${zone.realm}`)}</span>
        </div>
        {placements.map(({ id, index: i, x, bottom, size, zIndex, depth }) => {
          const react = reaction?.id === id ? (REACTIONS[id] ?? { anim: 'hop', emote: '!' }) : null;
          return (
            <button
              key={id}
              className={`hub-member depth-${depth}`}
              style={
                {
                  left: `${x}%`,
                  bottom,
                  zIndex,
                  '--delay': `${-i * 0.7}s`,
                } as CSSProperties
              }
              aria-label={i === 0 ? `${t(`creature.${id}`)} · ${t('home.leader')}` : t(`creature.${id}`)}
              onClick={() => setReaction((r) => ({ id, n: (r?.n ?? 0) + 1 }))}
            >
              <div className="hub-shadow" />
              {i === 0 && (
                <span className="hub-leader" aria-hidden="true">
                  ★
                </span>
              )}
              <div
                key={react ? reaction!.n : 0}
                className={react ? `hub-react react-${react.anim}` : 'hub-react'}
              >
                <Sprite id={id} size={size} scale="stage" className="breathe hub-idle" />
              </div>
              {react && (
                <span key={reaction!.n} className="hub-emote" aria-hidden="true">
                  {react.emote}
                </span>
              )}
            </button>
          );
        })}
        <HubAvatar onOpen={() => onOpen('wardrobe')} />
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
