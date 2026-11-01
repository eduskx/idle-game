import { useEffect, useRef, type CSSProperties } from 'react';
import { getEnemy, getZone } from '../../data/world';
import {
  BALANCE,
  buyUpgrade,
  canBuyUpgrade,
  estimatedDps,
  globalModifiers,
  isBossStage,
  KILLS_PER_STAGE,
  stageInZone,
  STAGES_PER_ZONE,
  teamStats,
  upgradeLevelCost,
  zoneOf,
  type CombatEvent,
  type UpgradeId,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Avatar } from '../avatar/Avatar';
import { ZoneBanner } from '../components/ZoneBanner';
import { ZoneScenery } from '../components/ZoneScenery';
import { Sprite } from '../components/Sprite';
import { Tips } from '../components/Tips';
import { TypeChips } from '../components/TypeChip';
import { TAMER_REACTION_MS, tamerReaction, type TamerReaction } from '../tamerReaction';

const QUICK: UpgradeId[] = ['sharpen', 'vitality', 'greed', 'wisdom'];

function HpBar({ value, max, tone }: { value: number; max: number; tone: 'enemy' | 'ally' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const level = pct > 50 ? 'high' : pct > 20 ? 'mid' : 'low';
  return (
    <div
      className={`hp hp-${tone} hp-${level}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div className="hp-ghost" style={{ width: `${pct}%` }} />
      <div className="hp-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

type HitEvent = Extract<CombatEvent, { t: 'hit' }>;

/** Whole-body motion of the tamer per reaction (transform only; origin at the feet via CSS). */
const TAMER_KEYFRAMES: Record<TamerReaction, Keyframe[]> = {
  // two happy hops with a squash on landing
  cheer: [
    { transform: 'none' },
    { transform: 'translateY(-14px) scale(0.96, 1.06)', offset: 0.2 },
    { transform: 'translateY(0) scale(1.06, 0.93)', offset: 0.38 },
    { transform: 'translateY(-9px) scale(0.98, 1.03)', offset: 0.58 },
    { transform: 'translateY(0) scale(1.03, 0.97)', offset: 0.76 },
    { transform: 'none' },
  ],
  // one big leap with a spin-wiggle, then a proud stretch
  triumph: [
    { transform: 'none' },
    { transform: 'translateY(4px) scale(1.06, 0.92)', offset: 0.1 },
    { transform: 'translateY(-24px) rotate(-8deg) scale(0.95, 1.08)', offset: 0.3 },
    { transform: 'translateY(-20px) rotate(8deg)', offset: 0.45 },
    { transform: 'translateY(0) scale(1.08, 0.9)', offset: 0.6 },
    { transform: 'translateY(-4px) scale(0.98, 1.05)', offset: 0.78 },
    { transform: 'none' },
  ],
  // recoil away from the hit, shake, then slowly straighten up
  flinch: [
    { transform: 'none' },
    { transform: 'translate(-7px, 3px) rotate(-7deg) scale(1.04, 0.94)', offset: 0.12 },
    { transform: 'translate(-3px, 2px) rotate(-4deg)', offset: 0.24 },
    { transform: 'translate(-6px, 2px) rotate(-6deg)', offset: 0.34 },
    { transform: 'translate(-4px, 2px) rotate(-5deg) scale(1.02, 0.96)', offset: 0.55 },
    { transform: 'none' },
  ],
};

/** Small emote icons over the tamer's head; hidden until a reaction animates one. */
function TamerEmotes({ refs }: { refs: { current: Partial<Record<TamerReaction, SVGSVGElement | null>> } }) {
  const set = (r: TamerReaction) => (el: SVGSVGElement | null) => {
    refs.current[r] = el;
  };
  const ink = '#2b1d17';
  return (
    <>
      <svg ref={set('cheer')} className="tamer-emote" viewBox="0 0 40 40">
        <path
          d="M20 4 L23.5 15.5 L35 19 L23.5 22.5 L20 34 L16.5 22.5 L5 19 L16.5 15.5 Z"
          fill="#ffd36b"
          stroke={ink}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path
          d="M33 4 L34.5 8 L38 9 L34.5 10.5 L33 14 L31.5 10.5 L28 9 L31.5 8 Z"
          fill="#fff3c4"
          stroke={ink}
          strokeWidth={1.4}
        />
      </svg>
      <svg ref={set('triumph')} className="tamer-emote big" viewBox="0 0 40 40">
        <path
          d="M4 9 L8 4 M36 9 L32 4 M2 21 L7 21 M38 21 L33 21"
          stroke="#ffd36b"
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path
          d="M20 5 L24 15 L35 15.5 L26.5 22.5 L29.5 33.5 L20 27 L10.5 33.5 L13.5 22.5 L5 15.5 L16 15 Z"
          fill="#ffc23a"
          stroke={ink}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path d="M17 17 L19 15.5" stroke="#fff3c4" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <svg ref={set('flinch')} className="tamer-emote" viewBox="0 0 40 40">
        <path d="M6 8 L11 13 M3 18 L9 19 M10 3 L13 9" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
        <path
          d="M26 6 Q35 18 35 25 Q35 33 27 33 Q19 33 19 25 Q19 18 26 6 Z"
          fill="#9fdcff"
          stroke={ink}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path d="M23 24 Q23 20 25 17" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}

export function BattleScreen() {
  const s = useGame();
  const { t, n } = useT();
  const b = s.battle;
  const zoneIdx = zoneOf(b.stage);
  const zone = getZone(zoneIdx);
  const mods = globalModifiers(s);
  const team = teamStats(s, mods);
  const enemy = b.enemy;
  const enemyDef = enemy ? getEnemy(enemy.defId) : null;
  const boss = isBossStage(b.stage);
  const active = team.find((m) => (b.teamHp[m.defId] ?? m.maxHp) > 0) ?? team[0];
  const activeOwned = active ? s.creatures[active.defId] : undefined;
  const motion = !s.settings.reducedMotion;

  // Hit animations driven by combat events (Web Animations API, transform/opacity only).
  const playerRef = useRef<HTMLDivElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  const enemyFlashRef = useRef<HTMLDivElement>(null);
  const enemyEffRef = useRef<HTMLDivElement>(null);
  const playerEffRef = useRef<HTMLDivElement>(null);
  const trainerRef = useRef<HTMLDivElement>(null);
  const emoteRefs = useRef<Partial<Record<TamerReaction, SVGSVGElement | null>>>({});
  const lastEff = useRef<Record<'enemy' | 'player', { key: string; at: number }>>({
    enemy: { key: '', at: 0 },
    player: { key: '', at: 0 },
  });
  const lastAnimated = useRef(0);
  const enemyKey = `${b.stage}-${s.lifetime.kills}`;
  const lastEvent = b.log[b.log.length - 1];
  useEffect(() => {
    if (!lastEvent || lastEvent.id <= lastAnimated.current) return;
    const fresh = b.log.filter((e) => e.id > lastAnimated.current);
    lastAnimated.current = lastEvent.id;
    if (typeof Element === 'undefined' || !('animate' in Element.prototype)) return;

    // Type effectiveness callout: pops once per matchup, refreshed every few seconds.
    const now = performance.now();
    for (const side of ['enemy', 'player'] as const) {
      const hit = fresh.find(
        (e): e is HitEvent => e.t === 'hit' && e.eff !== 1 && (e.target === 'enemy') === (side === 'enemy'),
      );
      const el = side === 'enemy' ? enemyEffRef.current : playerEffRef.current;
      if (!hit || !el) continue;
      const good = hit.eff > 1;
      const key = `${enemyKey}:${hit.target}:${good}`;
      const prev = lastEff.current[side];
      if (prev.key === key && now - prev.at < 6000) continue;
      if (now - prev.at < 1200) continue;
      lastEff.current[side] = { key, at: now };
      el.textContent = t(good ? 'battle.superEffective' : 'battle.notEffective');
      el.className = `eff-pop ${good ? 'super' : 'weak'}`;
      el.animate(
        motion
          ? [
              { opacity: 0, transform: 'translate(-50%, 6px) scale(0.6)' },
              { opacity: 1, transform: 'translate(-50%, 0) scale(1.12)', offset: 0.15 },
              { opacity: 1, transform: 'translate(-50%, 0) scale(1)', offset: 0.3 },
              { opacity: 1, transform: 'translate(-50%, -4px) scale(1)', offset: 0.8 },
              { opacity: 0, transform: 'translate(-50%, -12px) scale(1)' },
            ]
          : [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }],
        { duration: 1400, easing: 'ease-out', fill: 'forwards' },
      );
    }

    // The tamer reacts to wins, beaten bosses and defeats (body motion + a small emote).
    const reaction = tamerReaction(fresh);
    if (reaction) {
      const ms = TAMER_REACTION_MS[reaction];
      const emote = emoteRefs.current[reaction];
      emote?.animate(
        motion
          ? [
              { opacity: 0, transform: 'translate(-50%, 8px) scale(0.5)' },
              { opacity: 1, transform: 'translate(-50%, -2px) scale(1.15)', offset: 0.18 },
              { opacity: 1, transform: 'translate(-50%, 0) scale(1)', offset: 0.32 },
              { opacity: 1, transform: 'translate(-50%, -6px) scale(1)', offset: 0.8 },
              { opacity: 0, transform: 'translate(-50%, -12px) scale(0.9)' },
            ]
          : [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }],
        { duration: ms, easing: 'ease-out' },
      );
      if (motion)
        trainerRef.current?.animate(TAMER_KEYFRAMES[reaction], { duration: ms, easing: 'ease-out' });
    }

    if (!motion) return;
    const playerHit = fresh.find((e): e is HitEvent => e.t === 'hit' && e.target === 'enemy');
    const enemyHit = fresh.find((e) => e.t === 'hit' && e.target !== 'enemy');
    if (playerHit) {
      playerRef.current?.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: 'translate(-6px,6px)', offset: 0.35 },
          { transform: 'translate(18px,-14px)', offset: 0.6 },
          { transform: 'translate(0,0)' },
        ],
        { duration: 260, easing: 'ease-out' },
      );
      enemyRef.current?.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: `translate(${playerHit.crit ? 12 : 7}px,-3px)`, offset: 0.3 },
          { transform: 'translate(0,0)' },
        ],
        { duration: 220, delay: 140, easing: 'ease-out' },
      );
      enemyFlashRef.current?.animate([{ opacity: 0 }, { opacity: 0.85, offset: 0.2 }, { opacity: 0 }], {
        duration: 180,
        delay: 140,
      });
    }
    if (enemyHit) {
      enemyRef.current?.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: 'translate(-22px,16px)', offset: 0.5 },
          { transform: 'translate(0,0)' },
        ],
        { duration: 300, easing: 'ease-in-out' },
      );
      playerRef.current?.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: 'translate(-8px,3px)', offset: 0.6 },
          { transform: 'translate(0,0)' },
        ],
        { duration: 220, delay: 150 },
      );
    }
  }, [lastEvent, b.log, motion, t, enemyKey]);

  const hits =
    s.settings.showDamageNumbers && motion
      ? b.log.filter((e): e is HitEvent => e.t === 'hit' && e.target === 'enemy').slice(-5)
      : [];

  const stageStyle = { '--sky-top': zone.palette[0], '--sky-bottom': zone.palette[1] } as CSSProperties;

  const synergy = mods.synergy;
  const synergyText =
    synergy.kind === 'pure'
      ? t('battle.synergyPure', {
          realm: t(`realm.${synergy.realm}`),
          bonus: Math.round((BALANCE.pureRealmBonus + 0.05 * s.talents.kinship) * 100),
        })
      : synergy.kind === 'twilight'
        ? t('battle.synergyTwilight', {
            bonus: Math.round((BALANCE.twilightBonus + 0.05 * s.talents.twilight) * 100),
          })
        : null;

  const enemyName = enemyDef
    ? t(enemyDef.alpha ? 'battle.alpha' : 'battle.wild', { name: t(`creature.${enemyDef.species}`) })
    : '';

  return (
    <div className="battle">
      <Tips state={s} />

      <div
        className={`stage realm-${zone.realm} zone-${zone.id} ${boss ? 'boss-stage' : ''}`}
        style={stageStyle}
      >
        <div className="stage-sky" />
        <ZoneScenery zoneId={zone.id} />
        <ZoneBanner zoneIndex={zoneIdx} />

        {enemy && enemyDef && (
          <div className="info-box enemy-box">
            <div className="info-head">
              <strong>{enemyName}</strong>
            </div>
            <TypeChips types={enemyDef.types} />
            <HpBar value={enemy.hp} max={enemy.maxHp} tone="enemy" />
            <div className="info-sub">
              {boss
                ? `⏳ ${t('battle.bossTimer', { seconds: Math.ceil(b.bossTimer ?? mods.bossTime) })}`
                : t('battle.kills', { kills: b.kills, needed: KILLS_PER_STAGE })}
            </div>
          </div>
        )}

        {enemy && enemyDef && (
          <div className="spot enemy-spot">
            <div className="platform platform-far" />
            <div ref={enemyRef} key={enemyKey} className="actor enemy-actor spawn">
              <Sprite
                id={enemyDef.species}
                alpha={enemyDef.alpha}
                size={enemyDef.alpha ? 146 : 122}
                scale="stage"
                label={enemyName}
                className="breathe"
              />
              <div ref={enemyFlashRef} className="hit-flash" />
            </div>
            <div className="dmg-layer" aria-hidden="true">
              {hits.map((h) => (
                <span
                  key={h.id}
                  className={`dmg ${h.crit ? 'crit' : ''} ${h.eff > 1 ? 'super' : h.eff < 1 ? 'weak' : ''}`}
                  style={{ left: `${20 + ((h.id * 37) % 55)}%` }}
                >
                  {n(h.amount)}
                </span>
              ))}
            </div>
            <div ref={enemyEffRef} className="eff-pop" aria-hidden="true" />
          </div>
        )}

        {active && (
          <div className="spot player-spot">
            <div className="platform platform-near" />
            {/* the tamer stands just behind the own monster, seen from behind like it */}
            <div ref={trainerRef} className={`trainer ${boss ? 'rally' : ''}`} aria-hidden="true">
              <Avatar avatar={s.avatar} view="back" className="breathe-av" />
              <TamerEmotes refs={emoteRefs} />
            </div>
            <div ref={playerRef} className="actor player-actor">
              <Sprite
                id={active.defId}
                view="back"
                size={176}
                scale="stage"
                label={t(`creature.${active.defId}`)}
                className="breathe slow"
              />
            </div>
            <div ref={playerEffRef} className="eff-pop" aria-hidden="true" />
          </div>
        )}

        {active && (
          <div className="info-box player-box">
            <div className="info-head">
              <strong>{t(`creature.${active.defId}`)}</strong>
              <span className="lv">Lv {activeOwned?.level ?? 1}</span>
            </div>
            <TypeChips types={active.types} />
            <HpBar value={b.teamHp[active.defId] ?? active.maxHp} max={active.maxHp} tone="ally" />
            <div className="info-sub num">
              {n(Math.max(0, b.teamHp[active.defId] ?? active.maxHp))} / {n(active.maxHp)}
            </div>
          </div>
        )}

        <div className="stage-label">
          <strong>{t(`zone.${zone.id}`)}</strong>
          <span>
            {t('battle.stage', { stage: b.stage })} · {stageInZone(b.stage)}/{STAGES_PER_ZONE}
          </span>
        </div>
      </div>

      <ul className="bench" aria-label={t('nav.team')}>
        {team.map((m) => {
          const hp = b.teamHp[m.defId] ?? m.maxHp;
          const pct = Math.max(0, Math.min(1, hp / m.maxHp));
          return (
            <li
              key={m.defId}
              className={`bench-slot ${m.defId === active?.defId ? 'active' : ''} ${hp <= 0 ? 'down' : ''}`}
              style={{ '--hp': pct } as CSSProperties}
              title={t(`creature.${m.defId}`)}
            >
              <Sprite id={m.defId} size={42} label={t(`creature.${m.defId}`)} />
              <span className="bench-lv">{s.creatures[m.defId]?.level ?? 1}</span>
            </li>
          );
        })}
      </ul>
      <div className="battle-meta">
        <span className="muted small">{t('battle.dps', { dps: n(estimatedDps(s)) })}</span>
        {synergyText && <span className="synergy-chip">{synergyText}</span>}
      </div>

      <label className="toggle advance">
        <input
          type="checkbox"
          checked={b.autoAdvance}
          onChange={(e) => gameStore.dispatch((st) => (st.battle.autoAdvance = e.target.checked))}
        />
        <span>
          {t('battle.autoAdvance')}:{' '}
          <strong>{b.autoAdvance ? t('battle.advancing') : t('battle.farming')}</strong>
        </span>
      </label>
      {!b.autoAdvance && <p className="notice">{t('battle.farmingHint')}</p>}

      <div className="quick-upgrades" aria-label={t('battle.quickUpgrades')}>
        {QUICK.map((id) => (
          <button
            key={id}
            className="btn quick"
            disabled={!canBuyUpgrade(s, id)}
            onClick={() => gameStore.dispatch((st) => buyUpgrade(st, id))}
          >
            <span>{t(`upgrade.${id}.name`)}</span>
            <small>
              {t('upgrades.level', { level: s.upgrades[id] })} · 🪙 {n(upgradeLevelCost(s, id))}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}
