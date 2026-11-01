import type { GameState } from '../engine/types';
import { fromUnknown, toSaveData } from './serialize';

/**
 * Storage abstraction. The game only talks to this interface, so a cloud
 * implementation (e.g. Supabase, see docs/CLOUD_SAVE.md) can be added without
 * touching game code.
 */
export interface SaveRepository {
  load(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
  clear(): Promise<void>;
}

const KEY = 'hollowbloom.save.v1';
const BACKUP_KEY = 'hollowbloom.save.backup';

export class LocalStorageRepository implements SaveRepository {
  constructor(private readonly storage: Storage = window.localStorage) {}

  async load(): Promise<GameState | null> {
    for (const key of [KEY, BACKUP_KEY]) {
      const raw = this.storage.getItem(key);
      if (!raw) continue;
      try {
        return fromUnknown(JSON.parse(raw));
      } catch (e) {
        console.warn(`[save] could not load ${key}`, e);
      }
    }
    return null;
  }

  async save(state: GameState): Promise<void> {
    const json = JSON.stringify(toSaveData(state));
    // Keep the previous good save as a backup in case the new write is interrupted.
    const previous = this.storage.getItem(KEY);
    if (previous) this.storage.setItem(BACKUP_KEY, previous);
    this.storage.setItem(KEY, json);
  }

  async clear(): Promise<void> {
    this.storage.removeItem(KEY);
    this.storage.removeItem(BACKUP_KEY);
  }
}

/** Fallback when storage is unavailable (private mode, blocked cookies). */
export class MemoryRepository implements SaveRepository {
  private data: string | null = null;
  async load(): Promise<GameState | null> {
    return this.data ? fromUnknown(JSON.parse(this.data)) : null;
  }
  async save(state: GameState): Promise<void> {
    this.data = JSON.stringify(toSaveData(state));
  }
  async clear(): Promise<void> {
    this.data = null;
  }
}

export function createDefaultRepository(): SaveRepository {
  try {
    const test = '__hb_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return new LocalStorageRepository();
  } catch {
    return new MemoryRepository();
  }
}
