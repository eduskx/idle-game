# Autonomous improvement loop – protocol

The owner asked for continuous, autonomous development of Hollowbloom, **one iteration per fresh
session**, focused on **design, UX and UI** (content stays, roster is 10 creatures). Each session:

## 0. Setup

- If the repo is not in the working directory: attach `eduskx/idle-game` with push access and clone it.
- `npm ci`.
- Read: `docs/CREATURE_BIBLE.md` (binding vision), `docs/DEVLOG.md` (what happened so far),
  `docs/research/VISUAL_UX_RESEARCH.md` (design research), `docs/ROADMAP.md`.

## 1. Lock check (one iteration at a time)

- List open PRs whose head branch starts with `loop/`.
  - If one is open and was updated **less than 3 hours ago**: another iteration is running → stop
    immediately, do nothing else.
  - If it is older: take it over. Finish it (fix CI, merge) or close it with a comment, then continue.

## 2. Evaluate

- `npm run art -- /tmp/art` → review the creature contact sheet against the bible **first**.
- Build and take Playwright screenshots at 390×844 (fresh game + a mid-game save) of all screens.
- Write down the 1–3 most valuable improvements. Creature art issues come first when they exist.

## 3. Build

- Branch `loop/<short-topic>` from latest `main`.
- Implement. Keep game logic intact; add/adjust tests when touching logic.
- `npm run check` and `npm run build` must pass. Look at the new screenshots before committing.
- Append an entry to `docs/DEVLOG.md` (what changed, why, what's next).

## 4. Ship

- Push, open a PR (summary + test plan), wait for CI (subscribe to PR activity, no polling loops).
- When CI is green: **merge it yourself** (the owner explicitly allowed this), using the head SHA.
- Rebuild the phone preview: `npm run build:preview` and republish
  `https://claude.ai/artifact/MAWN6Y9yc1bxGP743aWYUP` with the Artifact tool (pass that URL; read it first if required).

## 5. Hand off

- Start the next iteration immediately by firing the loop's scheduled task (`Hollowbloom Loop`) once.
  If that is not possible, the hourly schedule will start it.
- End the session.

## Hard rules

- **Never create costs.** No paid services, no paid APIs, no app-store fees.
- Never force-push, never rewrite `main`, never skip or disable tests.
- Don't merge Dependabot PRs blindly; evaluate them in a dedicated iteration.
- Stop everything when the owner says "Stopp" (delete the scheduled task).
- Copyright: all art original; no copying of existing games' creatures.
