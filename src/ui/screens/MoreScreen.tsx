import { useState } from 'react';
import { APP_VERSION } from '../../config/legal';
import { ACHIEVEMENT_BONUS, ACHIEVEMENTS } from '../../data/progression';
import { formatDuration } from '../../i18n';
import { useT } from '../../i18n/useT';
import { exportSave, importSave } from '../../persistence/serialize';
import { gameStore, useGame } from '../../store/gameStore';
import { ConfirmDialog, Modal, Section } from '../components/common';
import { LegalContent, type LegalPage } from './Legal';

export function MoreScreen() {
  const s = useGame();
  const { t, n } = useT();
  const [legal, setLegal] = useState<LegalPage | null>(null);
  const [exportCode, setExportCode] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [confirmImport, setConfirmImport] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function onExport() {
    const code = exportSave(s);
    try {
      await navigator.clipboard.writeText(code);
      gameStore.toast(t('more.exported'), 'success');
    } catch {
      setExportCode(code);
    }
  }

  function onImport() {
    try {
      const next = importSave(importText);
      void gameStore.replaceState(next);
      setImportText('');
      gameStore.toast(t('more.importOk'), 'success');
    } catch {
      gameStore.toast(t('more.importError'), 'warning');
    }
    setConfirmImport(false);
  }

  const lt = s.lifetime;
  const stats: [string, string][] = [
    [t('stats.highestStage'), n(lt.highestStage)],
    [t('stats.kills'), n(lt.kills)],
    [t('stats.bossKills'), n(lt.bossKills)],
    [t('stats.goldEarned'), n(lt.goldEarned)],
    [t('stats.summons'), n(lt.summons)],
    [t('stats.reblooms'), n(lt.reblooms)],
    [t('stats.playTime'), formatDuration(lt.playSeconds)],
  ];

  return (
    <>
      <Section
        title={t('more.achievements')}
        aside={
          <span className="pill">
            {s.achievements.length}/{ACHIEVEMENTS.length}
          </span>
        }
      >
        <p className="small muted">
          {t('more.achievementBonus', {
            bonus: Math.round(ACHIEVEMENT_BONUS * 100),
            total: Math.round(ACHIEVEMENT_BONUS * 100 * s.achievements.length),
          })}
        </p>
        <ul className="achievements">
          {ACHIEVEMENTS.map((a) => {
            const done = s.achievements.includes(a.id);
            return (
              <li key={a.id} className={done ? 'done' : ''}>
                <span aria-hidden="true">{done ? '🏆' : '○'}</span> {t(`achievement.${a.id}`)}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={t('more.stats')}>
        <dl className="stats">
          {stats.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t('more.settings')}>
        <div className="setting">
          <label htmlFor="lang">{t('more.language')}</label>
          <select
            id="lang"
            value={s.settings.language}
            onChange={(e) =>
              gameStore.dispatch((st) => (st.settings.language = e.target.value === 'de' ? 'de' : 'en'))
            }
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
        <label className="toggle setting">
          <input
            type="checkbox"
            checked={s.settings.reducedMotion}
            onChange={(e) => gameStore.dispatch((st) => (st.settings.reducedMotion = e.target.checked))}
          />
          <span>{t('more.reducedMotion')}</span>
        </label>
        <label className="toggle setting">
          <input
            type="checkbox"
            checked={s.settings.showDamageNumbers}
            onChange={(e) => gameStore.dispatch((st) => (st.settings.showDamageNumbers = e.target.checked))}
          />
          <span>{t('more.damageNumbers')}</span>
        </label>
      </Section>

      <Section title={t('more.save')}>
        <p className="small muted">{t('more.saveHint')}</p>
        <div className="row gap wrap">
          <button className="btn primary" onClick={() => void onExport()}>
            {t('more.export')}
          </button>
        </div>
        <label className="sr-only" htmlFor="import">
          {t('more.import')}
        </label>
        <textarea
          id="import"
          className="import"
          rows={3}
          maxLength={200_000}
          spellCheck={false}
          autoComplete="off"
          placeholder={t('more.importPlaceholder')}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <div className="row gap wrap">
          <button className="btn ghost" disabled={!importText.trim()} onClick={() => setConfirmImport(true)}>
            {t('more.import')}
          </button>
          <button className="btn danger" onClick={() => setConfirmReset(true)}>
            {t('more.reset')}
          </button>
        </div>
      </Section>

      <Section title={t('more.legal')}>
        <div className="row gap wrap">
          <button className="btn link" onClick={() => setLegal('privacy')}>
            {t('more.privacy')}
          </button>
          <button className="btn link" onClick={() => setLegal('imprint')}>
            {t('more.imprint')}
          </button>
          <button className="btn link" onClick={() => setLegal('credits')}>
            {t('more.credits')}
          </button>
        </div>
        <p className="tiny muted">{t('more.version', { version: APP_VERSION })}</p>
      </Section>

      {legal && (
        <Modal title={t(`more.${legal}`)} onClose={() => setLegal(null)}>
          <LegalContent page={legal} />
          <div className="row end">
            <button className="btn primary" onClick={() => setLegal(null)}>
              {t('common.close')}
            </button>
          </div>
        </Modal>
      )}
      {exportCode && (
        <Modal title={t('more.export')} onClose={() => setExportCode(null)}>
          <p>{t('more.exportFallback')}</p>
          <textarea
            className="import"
            rows={6}
            readOnly
            value={exportCode}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="row end">
            <button className="btn primary" onClick={() => setExportCode(null)}>
              {t('common.close')}
            </button>
          </div>
        </Modal>
      )}
      {confirmImport && (
        <ConfirmDialog
          text={t('more.importConfirm')}
          onConfirm={onImport}
          onCancel={() => setConfirmImport(false)}
        />
      )}
      {confirmReset && (
        <ConfirmDialog
          danger
          text={t('more.resetConfirm')}
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            void gameStore.reset();
            setConfirmReset(false);
          }}
        />
      )}
    </>
  );
}
