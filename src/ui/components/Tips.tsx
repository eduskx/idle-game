import { useState } from 'react';
import { BALANCE, expeditionsUnlocked, type GameState } from '../../engine';
import { useT } from '../../i18n/useT';

interface Tip {
  id: string;
  when: (s: GameState) => boolean;
}

/** Contextual first-time hints, shown one at a time on the battle screen. */
const TIPS: Tip[] = [
  { id: 'welcome', when: () => true },
  { id: 'summon', when: (s) => s.currencies.essence >= 10 && s.lifetime.summons === 0 },
  { id: 'boss', when: (s) => s.lifetime.highestStage >= 9 && s.lifetime.bossKills === 0 },
  { id: 'synergy', when: (s) => Object.keys(s.creatures).length >= 4 },
  { id: 'expeditions', when: (s) => expeditionsUnlocked(s) && s.expeditions.length === 0 },
  { id: 'rebloom', when: (s) => s.runHighestStage >= BALANCE.rebloomMinStage && s.lifetime.reblooms === 0 },
];

const KEY = 'hollowbloom.tips';

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function Tips({ state }: { state: GameState }) {
  const { t } = useT();
  const [seen, setSeen] = useState<string[]>(readSeen);
  const tip = TIPS.find((x) => !seen.includes(x.id) && x.when(state));
  if (!tip) return null;

  function dismiss() {
    const next = [...seen, tip!.id];
    setSeen(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="tip" role="note">
      <span aria-hidden="true">💡</span>
      <p>{t(`tips.${tip.id}`)}</p>
      <button className="btn ghost" onClick={dismiss}>
        {t('tips.ok')}
      </button>
    </div>
  );
}
