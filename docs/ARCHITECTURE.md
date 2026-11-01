# Architecture

```
            ┌──────────────┐  dispatch(action)   ┌──────────────────┐
  React UI ─┤ useGame()    │ ──────────────────► │ GameStore        │
  (screens) │ useSyncExt.. │ ◄── emit/revision ── │ loop 10 Hz, save │
            └──────────────┘                      └───────┬──────────┘
                                                          │ mutates
                                         ┌────────────────▼───────────────┐
                                         │ engine/ (pure TS, no DOM)      │
                                         │ combat · progression · offline │
                                         │ formulas · stats · rng         │
                                         └────────────────┬───────────────┘
                                                          │ reads
                                                    data/ (content)
                     persistence/ ── SaveRepository ── LocalStorage | Memory | (Cloud later)
```

## Key decisions

| Decision                                                      | Why                                                                                                                              |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Engine as pure TypeScript**                                 | Unit-testable, headless balance simulation, reusable on a server later (cloud-save validation).                                  |
| **Mutable state + revision counter** instead of Redux/Zustand | 10 ticks/s with zero allocations per tick; React re-renders via `useSyncExternalStore`. Actions go through `gameStore.dispatch`. |
| **Deterministic RNG in the save**                             | No reload-to-reroll exploits; reproducible bugs.                                                                                 |
| **Zod schema for every load/import**                          | Saves are untrusted input. Validates types, ranges and finiteness; unknown content is dropped, not crashed on.                   |
| **Versioned saves + migrations**                              | `SAVE_VERSION` + `persistence/migrations.ts`, so updates never wipe progress.                                                    |
| **`SaveRepository` interface**                                | Local storage today; a cloud repository can be added without touching game code (see CLOUD_SAVE.md).                             |
| **Plain numbers** (not big-number libs)                       | Enough headroom (1e308) for the current curve; revisit with `break_eternity.js` if endless cycles go beyond.                     |
| **Lazy-loaded screens**                                       | Small first paint on mobile.                                                                                                     |
| **PWA with prompt-to-update**                                 | Installable and offline; the game saves before activating a new service worker.                                                  |
| **No external origins**                                       | Strict CSP, GDPR-friendly (no Google Fonts/CDNs).                                                                                |

## Testing

- `src/engine/engine.test.ts` – formulas, combat determinism, progression, rebloom, offline.
- `src/persistence/persistence.test.ts` – round trips, tamper detection, invalid values.
- `src/i18n/i18n.test.ts` – key parity de/en, every content id translated.
- `scripts/simulate.ts` – balance regression by hand (compare milestone times before/after changes).
