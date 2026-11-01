# Hollowbloom 🌸🦇

An idle creature-battler where cozy **Hearth** creatures and dark **Umbra** creatures fight side by side.
Collect creatures, build a team, push through endless zones and **rebloom** (prestige) to grow stronger.

Built as an installable, offline-capable **PWA** with React, TypeScript and Vite. No backend, no tracking, no costs.

## Features

- **Auto-battle team** (3–6 creatures) with front-line/taunt targeting, element triangle (Ember > Grove > Tide > Ember) and 12 creature abilities.
- **30 creatures** across two realms and five rarities, summoned with essence; duplicates raise stars (up to 10★).
- **Realm synergies**: pure teams gain _Kinship_ (attack/HP), balanced mixed teams gain _Twilight_ (gold/XP), so both moods are viable.
- **12 zones × 50 stages**, bosses every 10 stages with a timer, then endless cycles with growing difficulty.
- **Gold upgrades**, **Rebloom prestige** with a 12-node talent tree, **21 achievements** with permanent bonuses.
- **Offline progress** (capped, extendable via talents), autosave, backup slot, export/import save codes.
- **German & English**, accessible controls (44px touch targets, focus states, reduced motion), strict CSP.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint + tests
npm run build      # production build in dist/
npm run simulate -- 72   # headless bot plays 72h of game time and prints pacing
```

Requires Node 22+.

## Project structure

```
src/
  engine/       Pure TypeScript game logic (no React): combat, progression, offline, formulas
  data/         Content: creatures, enemies, zones, upgrades, talents, achievements
  persistence/  Save schema (Zod), migrations, storage repositories, export/import
  i18n/         Dictionaries (de/en) and helpers
  store/        Game loop + external store bridging engine and React
  ui/           React components and screens
  config/       Legal/operator config
scripts/        Balance simulation, icon rendering
docs/           Design, architecture, legal, art and roadmap notes
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md).

## Deployment

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.
One-time setup: **Settings → Pages → Source: GitHub Actions**. Free for public repositories.

## License

Copyright © 2026 Eduard Lisovskij. **All rights reserved.** The source is public for portfolio purposes only; see [LICENSE](LICENSE).
