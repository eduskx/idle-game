# Devlog

Continuous improvement loop: evaluate (screenshots at 390×844) → improve → check → PR → merge.

## Iteration 1 – Unique creatures & 2.5D battle stage

- Roster reduced from 30 to **10 hand-designed species** (5 Hearth, 5 Umbra), each on a distinct
  animal/object base (hedgehog, red panda, otter, teacup spirit, bear / lantern wisp, skull crow,
  three-tailed cat, helm hermit crab, sea serpent). Vector SVG with cel shading, front + back views.
- Enemies are now **wild** members of those species; bosses are crowned **alpha** specimens.
- New **2.5D battle stage**: own creature from behind bottom-left on a near platform, enemy top-right
  on a far platform, perspective floor, parallax hills per realm, atmospheric haze, classic info boxes
  with ghost HP bars, bench portraits with HP rings, lunge/flash/knockback via Web Animations API.
- Old saves are repaired automatically (removed creatures dropped, starters guaranteed).
- Research report: `docs/research/VISUAL_UX_RESEARCH.md`.
- Deploy workflow switched to manual until GitHub Pages is enabled.
- Single-file **phone preview** build (`npm run build:preview` → `dist-preview/hollowbloom.html`),
  published as a private claude.ai page after each iteration.
