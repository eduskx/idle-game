import { useEffect, useRef, type ReactNode } from 'react';
import { useT } from '../../i18n/useT';

export function ProgressBar({ value, max, tone = 'hp', label }: { value: number; max: number; tone?: 'hp' | 'xp' | 'boss' | 'enemy'; label?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className={`bar bar-${tone}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label={label}>
      <div className="bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose?: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
    </dialog>
  );
}

export function ConfirmDialog({ text, onConfirm, onCancel, danger }: { text: string; onConfirm: () => void; onCancel: () => void; danger?: boolean }) {
  const { t } = useT();
  return (
    <Modal title={t('common.confirm')} onClose={onCancel}>
      <p>{text}</p>
      <div className="row gap end">
        <button className="btn ghost" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button className={`btn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm} autoFocus>
          {t('common.confirm')}
        </button>
      </div>
    </Modal>
  );
}

const ICONS = { gold: '🪙', essence: '✨', seeds: '🌱' } as const;

export function Currency({ kind, amount }: { kind: keyof typeof ICONS; amount: number }) {
  const { t, n } = useT();
  return (
    <span className={`currency currency-${kind}`} title={t(`currency.${kind}`)}>
      <span aria-hidden="true">{ICONS[kind]}</span>
      <span className="sr-only">{t(`currency.${kind}`)}: </span>
      {n(amount)}
    </span>
  );
}

export function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="section">
      <header className="section-head">
        <h2>{title}</h2>
        {aside}
      </header>
      {children}
    </section>
  );
}
