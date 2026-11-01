import { getCreature } from '../../data/creatures';
import { getEnemy, getZone } from '../../data/world';
import {
  BALANCE,
  BOSS_TIME,
  estimatedDps,
  globalModifiers,
  isBossStage,
  KILLS_PER_STAGE,
  stageInZone,
  STAGES_PER_ZONE,
  teamStats,
  zoneOf,
} from '../../engine';
import { useT } from '../../i18n/useT';
import { gameStore, useGame } from '../../store/gameStore';
import { ProgressBar } from '../components/common';
import { Sprite } from '../components/Sprite';

export function BattleScreen() {
  const s = useGame();
  const { t, n } = useT();
  const b = s.battle;
  const zoneIdx = zoneOf(b.stage);
  const zone = getZone(zoneIdx);
  const enemy = b.enemy;
  const enemyDef = enemy ? getEnemy(enemy.defId) : null;
  const mods = globalModifiers(s);
  const team = teamStats(s, mods);
  const boss = isBossStage(b.stage);
  const lastEvent = b.log[b.log.length - 1];
  const hits = s.settings.showDamageNumbers ? b.log.filter((e) => e.t === 'hit').slice(-6) : [];

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
        : t('battle.synergyNone');

  return (
    <div className="battle">
      <div
        className={`arena realm-${zone.realm}`}
        style={{ background: `linear-gradient(160deg, ${zone.palette[0]}, ${zone.palette[1]})` }}
      >
        <div className="arena-head">
          <div>
            <div className="zone-name">{t(`zone.${zone.id}`)}</div>
            <div className="stage-label">
              {t('battle.stage', { stage: b.stage })} · {stageInZone(b.stage)}/{STAGES_PER_ZONE}
            </div>
          </div>
          <div className="arena-progress">
            {boss ? (
              <span className="boss-tag">
                {t('battle.boss')} {t('battle.bossTimer', { seconds: Math.ceil(b.bossTimer ?? BOSS_TIME) })}
              </span>
            ) : (
              <span>{t('battle.kills', { kills: b.kills, needed: KILLS_PER_STAGE })}</span>
            )}
          </div>
        </div>

        <div className="field">
          <div className="team-side">
            {team.map((m, i) => {
              const def = getCreature(m.defId);
              const hp = b.teamHp[m.defId] ?? m.maxHp;
              const hit = hits.some((h) => h.t === 'hit' && h.target === m.defId && h.id === lastEvent?.id);
              return (
                <div key={m.defId} className={`fighter ${hp <= 0 ? 'down' : ''} ${hit ? 'shake' : ''}`} style={{ '--i': i } as React.CSSProperties}>
                  <Sprite id={def.id} look={def.look} realm={def.realm} size={i === 0 ? 72 : 60} label={t(`creature.${def.id}`)} dim={hp <= 0} />
                  <ProgressBar value={hp} max={m.maxHp} label={t(`creature.${def.id}`)} />
                </div>
              );
            })}
          </div>

          <div className="enemy-side">
            {enemy && enemyDef && (
              <div key={`${b.stage}-${s.lifetime.kills}`} className={`fighter enemy ${enemy.isBoss ? 'is-boss' : ''} spawn`}>
                <div className="enemy-name">{t(`enemy.${enemyDef.id}`)}</div>
                <Sprite
                  id={enemyDef.id}
                  look={enemyDef.look}
                  realm={enemyDef.realm}
                  size={enemy.isBoss ? 132 : 104}
                  flip
                  label={t(`enemy.${enemyDef.id}`)}
                />
                <ProgressBar value={enemy.hp} max={enemy.maxHp} tone={enemy.isBoss ? 'boss' : 'enemy'} label={t(`enemy.${enemyDef.id}`)} />
                <div className="enemy-hp">
                  {n(Math.max(0, enemy.hp))} / {n(enemy.maxHp)}
                </div>
                {!s.settings.reducedMotion && (
                  <div className="dmg-layer" aria-hidden="true">
                    {hits
                      .filter((h) => h.t === 'hit' && h.target === 'enemy')
                      .map((h) =>
                        h.t === 'hit' ? (
                          <span key={h.id} className={`dmg ${h.crit ? 'crit' : ''}`} style={{ left: `${(h.id * 37) % 70}%` }}>
                            {n(h.amount)}
                          </span>
                        ) : null,
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {boss && <ProgressBar value={b.bossTimer ?? BOSS_TIME} max={BOSS_TIME} tone="boss" label="boss timer" />}
      </div>

      <div className="battle-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={b.autoAdvance}
            onChange={(e) => gameStore.dispatch((st) => (st.battle.autoAdvance = e.target.checked))}
          />
          <span>
            {t('battle.autoAdvance')}: <strong>{b.autoAdvance ? t('battle.advancing') : t('battle.farming')}</strong>
          </span>
        </label>
        <div className="muted">{t('battle.dps', { dps: n(estimatedDps(s)) })}</div>
      </div>
      {!b.autoAdvance && <p className="notice">{t('battle.farmingHint')}</p>}
      <p className="synergy">{synergyText}</p>
      <p className="muted small">
        {t('battle.zone', { zone: zoneIdx + 1 })} · {t(`realm.${zone.realm}`)}
      </p>
    </div>
  );
}
