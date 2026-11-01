import { useSyncExternalStore } from 'react';
import {
  applyOfflineProgress,
  checkAchievements,
  createInitialState,
  simulate,
  type GameState,
  type OfflineReport,
} from '../engine';
import { translate } from '../i18n';
import { createDefaultRepository, type SaveRepository } from '../persistence/repository';

const TICK_MS = 100;
const AUTOSAVE_MS = 15_000;
/** Gaps longer than this (tab in background, device asleep) count as offline time. */
const MAX_LIVE_GAP_S = 60;

export interface Toast {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'warning';
}

export interface UiState {
  offlineReport: OfflineReport | null;
  toasts: Toast[];
  newAchievements: string[];
}

type Listener = () => void;

/**
 * Small external store around the mutable game state. The engine mutates the
 * state in place (cheap, no allocation per tick); every change bumps `revision`
 * so React re-renders through useSyncExternalStore.
 */
class GameStore {
  state: GameState = createInitialState();
  ui: UiState = { offlineReport: null, toasts: [], newAchievements: [] };
  revision = 0;
  ready = false;

  private listeners = new Set<Listener>();
  private repo: SaveRepository | null = null;
  private loopId: ReturnType<typeof setInterval> | null = null;
  private saveId: ReturnType<typeof setInterval> | null = null;
  private lastTick = 0;
  private toastId = 0;
  private lastEventId = 0;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getRevision = (): number => this.revision;

  private emit(): void {
    this.revision++;
    for (const l of this.listeners) l();
  }

  async init(repo: SaveRepository = createDefaultRepository()): Promise<void> {
    if (this.ready) return;
    this.repo = repo;
    let loaded: GameState | null = null;
    try {
      loaded = await repo.load();
    } catch (e) {
      console.warn('[store] load failed, starting fresh', e);
    }
    this.state = loaded ?? createInitialState();
    if (loaded) this.ui.offlineReport = applyOfflineProgress(this.state);
    this.state.lastSeen = Date.now();
    this.ready = true;
    this.start();
    this.emit();
  }

  private start(): void {
    this.lastTick = performance.now();
    this.loopId = setInterval(() => this.loop(), TICK_MS);
    this.saveId = setInterval(() => void this.save(), AUTOSAVE_MS);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibility);
      window.addEventListener('pagehide', this.onHide);
    }
  }

  stop(): void {
    if (this.loopId) clearInterval(this.loopId);
    if (this.saveId) clearInterval(this.saveId);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibility);
      window.removeEventListener('pagehide', this.onHide);
    }
    this.ready = false;
  }

  private onHide = (): void => {
    void this.save();
  };

  private onVisibility = (): void => {
    if (document.visibilityState === 'hidden') {
      void this.save();
    } else {
      this.catchUp();
    }
  };

  /** Applies offline progress after a long pause (e.g. phone screen was off). */
  private catchUp(): void {
    const away = Math.max(0, (Date.now() - this.state.lastSeen) / 1000);
    if (away <= MAX_LIVE_GAP_S) {
      simulate(this.state, away, TICK_MS / 1000);
      this.state.lastSeen = Date.now();
    } else {
      const report = applyOfflineProgress(this.state);
      if (report) this.ui.offlineReport = report;
    }
    this.lastTick = performance.now();
    this.emit();
  }

  private loop(): void {
    const now = performance.now();
    const gap = (now - this.lastTick) / 1000;
    this.lastTick = now;
    if (gap > MAX_LIVE_GAP_S) {
      this.catchUp();
      return;
    }
    // Short hiccups (throttled timers, brief screen lock) are simulated at full speed
    // in fixed steps; only real absences go through the offline calculation.
    simulate(this.state, gap, TICK_MS / 1000);
    this.state.lastSeen = Date.now();
    this.reportCombatEvents();
    this.afterChange();
  }

  /** Turns important combat events into toasts. */
  private reportCombatEvents(): void {
    const lang = this.state.settings.language;
    for (const e of this.state.battle.log) {
      if (e.id <= this.lastEventId) continue;
      if (e.t === 'defeat') this.toast(translate(lang, 'battle.defeated'), 'warning');
      if (e.t === 'bossFail') this.toast(translate(lang, 'battle.bossFailed'), 'warning');
      if (e.t === 'charm') {
        this.toast(
          translate(lang, 'charm.found', { name: translate(lang, `charm.${e.charm}.name`) }),
          'success',
        );
      }
    }
    const last = this.state.battle.log[this.state.battle.log.length - 1];
    if (last) this.lastEventId = last.id;
  }

  private afterChange(): void {
    const unlocked = checkAchievements(this.state);
    if (unlocked.length) this.ui.newAchievements = [...this.ui.newAchievements, ...unlocked];
    this.emit();
  }

  /** Runs a game action (mutating) and refreshes the UI. */
  dispatch<T>(action: (s: GameState) => T): T {
    const result = action(this.state);
    this.afterChange();
    return result;
  }

  async save(): Promise<void> {
    if (!this.repo || !this.ready) return;
    try {
      this.state.lastSeen = Date.now();
      await this.repo.save(this.state);
    } catch (e) {
      console.warn('[store] save failed', e);
    }
  }

  async replaceState(next: GameState): Promise<void> {
    this.state = next;
    this.state.lastSeen = Date.now();
    await this.save();
    this.emit();
  }

  async reset(): Promise<void> {
    await this.repo?.clear();
    this.state = createInitialState();
    this.ui = { offlineReport: null, toasts: [], newAchievements: [] };
    await this.save();
    this.emit();
  }

  dismissOffline(): void {
    this.ui.offlineReport = null;
    this.emit();
  }

  consumeAchievements(): string[] {
    const list = this.ui.newAchievements;
    this.ui.newAchievements = [];
    return list;
  }

  toast(text: string, tone: Toast['tone'] = 'info'): void {
    const id = ++this.toastId;
    this.ui.toasts = [...this.ui.toasts.slice(-3), { id, text, tone }];
    this.emit();
    setTimeout(() => {
      this.ui.toasts = this.ui.toasts.filter((t) => t.id !== id);
      this.emit();
    }, 3500);
  }
}

export const gameStore = new GameStore();

/** Re-renders the calling component on every state change and returns the live state. */
export function useGame(): GameState {
  useSyncExternalStore(gameStore.subscribe, gameStore.getRevision);
  return gameStore.state;
}

export function useUi(): UiState {
  useSyncExternalStore(gameStore.subscribe, gameStore.getRevision);
  return gameStore.ui;
}
