# Roadmap

Ordered by value for players vs. effort. Everything here can be built without running costs.

## Next (polish & retention)

- [ ] **Real art** for 30 creatures + 24 enemies (see ART_GUIDE.md), zone backgrounds.
- [ ] **Sound & music** (own or CC0 assets, with mute toggle; license list in Credits).
- [ ] **Balance pass with real players**: the bot (`npm run simulate`) is faster than humans. Collect feedback on the walls at ~stage 150 and ~300.
- [ ] **Number abbreviations setting** (scientific vs. suffixes).
- [ ] **Bundle size**: switch Zod to `zod/mini` (~-40 KB) once the schema is stable.
- [ ] **E2E tests** with Playwright (critical flows: first summon, rebloom, export/import).

## Long-term content (to reach "months of play")

- [ ] **Eclipse** (2nd prestige layer) at the end of the first zone cycle (stage 600): resets seeds/talents for a new currency with large multipliers.
- [ ] **Creature ascension** beyond 10★ (cosmetic aura + new ability tier).
- [ ] **Active abilities** (optional tap skills with cooldowns) for players who want to play actively.
- [ ] **More zones and enemies per cycle**, seasonal events (purely client-side, date-based).
- [ ] **Big numbers**: move to `break_eternity.js` once cycles exceed ~1e300.

## Platform

- [ ] **Cloud save** (Supabase free tier), see CLOUD_SAVE.md. Needs privacy-policy update.
- [ ] **Android app** via Trusted Web Activity (Play Store: one-time 25 USD; optional).
- [ ] **Error reporting** (self-hosted or privacy-friendly; needs consent/privacy update).

## Monetization (only after LEGAL.md checklist)

- [ ] Supporter link (Ko-fi/GitHub Sponsors) in "More".
- [ ] Cosmetic supporter perks (sprite skins, name color). **Never pay-to-win, never paid loot boxes.**
