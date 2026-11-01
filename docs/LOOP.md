# Autonomous improvement loop – protocol

The owner asked for continuous, autonomous development of Hollowbloom, **one iteration per fresh
session**, focused on **design, UX and UI** (content stays, roster is 10 creatures).

**Who does what:** an **orchestrator session** starts each iteration as a new session with
`eduskx/idle-game` as its source (repo already checked out), waits for it to finish, then publishes the
phone preview and starts the next iteration. The **iteration session** runs steps 0–4 below and ends
after its PR is merged. It does not start other sessions, fire scheduled tasks or publish the preview.

## 0. Setup

- The repo is already checked out by the orchestrator. `npm ci`.
- Read: `docs/CREATURE_BIBLE.md` (binding vision), `docs/DEVLOG.md` (what happened so far),
  `docs/research/VISUAL_UX_RESEARCH.md` (design research), `docs/ROADMAP.md`.

## 1. One iteration at a time

The orchestrator only starts the next session after the previous one has merged, so there is no lock
check. If an open `loop/` PR from an earlier session is still around, finish it (fix CI, merge) or close
it with a comment before starting new work.

## 2. Evaluate

- `npm run art -- <dir>` (creates the dir) → review the creature contact sheet against the bible **first**.
- Build and take Playwright screenshots at 390×844 (fresh game + a mid-game save) of all screens.
- Write down the 1–3 most valuable improvements. Creature art issues come first when they exist.

## 3. Build

- Use the branch the session instructions name; otherwise `loop/<short-topic>` from latest `main`.
- Implement. Keep game logic intact; add/adjust tests when touching logic.
- `npm run check` and `npm run build` must pass. Look at the new screenshots before committing.
- Append an entry to `docs/DEVLOG.md` (what changed, why, what's next).

## 4. Ship

- Push, open a PR titled `[loop] <topic>` (summary + test plan), wait for CI (subscribe to PR
  activity, no polling loops).
- When CI is green: **merge it yourself** (the owner explicitly allowed this), using the head SHA.
- Final message (German, short, honest): what changed, PR link, merged yes/no. **The iteration ends here.**

## 5. Hand off (orchestrator only)

- Rebuild the phone preview from `main`: `npm run build:preview` and republish
  `https://claude.ai/artifact/MAWN6Y9yc1bxGP743aWYUP` with the Artifact tool.
- Start the next iteration session with the repo as source.

## Hard rules

- **Never create costs.** No paid services, no paid APIs, no app-store fees.
- Never force-push, never rewrite `main`, never skip or disable tests.
- Don't merge Dependabot PRs blindly; evaluate them in a dedicated iteration.
- Stop everything when the owner says "Stopp" (delete the scheduled task).
- Copyright: all art original; no copying of existing games' creatures.
