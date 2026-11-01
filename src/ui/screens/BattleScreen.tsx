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
  type Realm,
  type UpgradeId,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { Sprite } from '../components/Sprite';
import { Tips } from '../components/Tips';

const QUICK: UpgradeId[] = ['sharpen', 'vitality', 'greed', 'wisdom'];

/** Far background silhouettes per realm, tinted by CSS variables. */
function Backdrop({ realm }: { realm: Realm }) {
  if (realm === 'umbra') {
    return (
      <svg className="stage-hills" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 120 L30 90 L44 104 L70 60 L84 80 L100 40 L112 70 L140 76 L160 50 L182 84 L210 64 L240 96 L262 58 L276 72 L300 30 L318 80 L350 70 L372 92 L400 76 L400 160 L0 160 Z"
          fill="var(--hill-far)"
        />
        <path
          d="M86 160 L86 70 L92 64 L98 70 L98 160 Z M300 160 L300 52 L306 44 L314 52 L314 160 Z"
          fill="var(--hill-far)"
        />
        <path
          d="M0 140 Q60 112 120 130 Q200 150 260 124 Q330 104 400 128 L400 160 L0 160 Z"
          fill="var(--hill-near)"
        />
        <g stroke="var(--hill-near)" strokeWidth={3} fill="none" strokeLinecap="round">
          <path d="M40 132 L40 100 M40 112 L30 102 M40 106 L50 96" />
          <path d="M350 130 L350 96 M350 110 L340 100 M350 104 L362 94" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="stage-hills" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 110 Q60 60 130 96 Q190 50 260 88 Q330 56 400 92 L400 160 L0 160 Z" fill="var(--hill-far)" />
      <path
        d="M0 136 Q80 104 160 126 Q240 146 320 116 Q370 102 400 118 L400 160 L0 160 Z"
        fill="var(--hill-near)"
      />
      <g fill="var(--hill-near)">
        <circle cx="52" cy="112" r="16" />
        <rect x="49" y="112" width="6" height="18" />
        <circle cx="338" cy="100" r="13" />
        <rect x="335" y="100" width="6" height="16" />
        <circle cx="356" cy="106" r="10" />
      </g>
    </svg>
  );
}

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
  const lastAnimated = useRef(0);
  const lastEvent = b.log[b.log.length - 1];
  useEffect(() => {
    if (!lastEvent || lastEvent.id <= lastAnimated.current) return;
    const fresh = b.log.filter((e) => e.id > lastAnimated.current);
    lastAnimated.current = lastEvent.id;
    if (!motion || typeof Element === 'undefined' || !('animate' in Element.prototype)) return;
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
  }, [lastEvent, b.log, motion]);

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

      <div className={`stage realm-${zone.realm} ${boss ? 'boss-stage' : ''}`} style={stageStyle}>
        <div className="stage-sky" />
        <Backdrop realm={zone.realm} />
        <div className="stage-floor" />

        {enemy && enemyDef && (
          <div className="info-box enemy-box">
            <div className="info-head">
              <span className={`el-dot el-${enemyDef.element}`} title={t(`element.${enemyDef.element}`)} />
              <strong>{enemyName}</strong>
            </div>
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
            <div ref={enemyRef} key={`${b.stage}-${s.lifetime.kills}`} className="actor enemy-actor spawn">
              <Sprite
                id={enemyDef.species}
                alpha={enemyDef.alpha}
                size={enemyDef.alpha ? 146 : 122}
                label={enemyName}
                className="breathe"
              />
              <div ref={enemyFlashRef} className="hit-flash" />
            </div>
            <div className="dmg-layer" aria-hidden="true">
              {hits.map((h) => (
                <span
                  key={h.id}
                  className={`dmg ${h.crit ? 'crit' : ''}`}
                  style={{ left: `${20 + ((h.id * 37) % 55)}%` }}
                >
                  {n(h.amount)}
                </span>
              ))}
            </div>
          </div>
        )}

        {active && (
          <div className="spot player-spot">
            <div className="platform platform-near" />
            <div ref={playerRef} className="actor player-actor">
              <Sprite
                id={active.defId}
                view="back"
                size={176}
                label={t(`creature.${active.defId}`)}
                className="breathe slow"
              />
            </div>
          </div>
        )}

        {active && (
          <div className="info-box player-box">
            <div className="info-head">
              <span className={`el-dot el-${active.element}`} />
              <strong>{t(`creature.${active.defId}`)}</strong>
              <span className="lv">Lv {activeOwned?.level ?? 1}</span>
            </div>
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
