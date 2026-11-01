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

## Iteration 2 – Faces, colors, shapes and size classes

Review against the bible: most species shared the same big glossy eyes + smile, Hexcat and Gloomwisp
were both violet, Puddlefin and Honeybear were both brown, and everything was drawn at the same size.

- **Expressions per bible:** Mossling peeks out from under a moss fringe with worried brows, a tiny
  wobbly mouth and a sweat drop. Emberpup squints with a cocked brow, lopsided grin and one fang.
  Puddlefin stares down at its pebble, mouth in an "o". Teacup has heavy half-closed lids, a yawn
  and drifting "z"s. Honeybear's eyes are closed in contentment. Gloomwisp got droopy eyes, a frown
  and a tear. Bonecrow's head is cocked, its sockets narrow slanted slits. Hexcat looks down its
  raised nose with half-lidded eyes and a one-sided smirk. Drowned Knight shows only two visor slits.
- **Colors:** Hexcat's flames are now emerald (Gloomwisp keeps violet), Puddlefin is slate/river
  blue with an amber pebble, Honeybear is honey gold with dark wax armor, Teacup's pattern is amber,
  Drowned Knight is teal-patinated steel with rust streaks and a dim amber glow behind the visor.
- **Shapes:** Mossling is a low, wide mound; Puddlefin a slender vertical oval; Honeybear a big
  square block (boxy body and head).
- **Size classes:** `size` (XS–XL) on every creature definition. Battle actors scale by
  0.6 / 0.8 / 1 / 1.2 / 1.35; portraits keep their slot and shrink small species (0.7–1).
  `spriteScale()` is unit-tested. Eclipse Wyrm now towers, Teacup fits in a hand.
- `Eye` in the art kit gained `lookY` and `pupil` (smaller pupils for nervous looks), and lost
  the second sparkle.

Next: Eclipse Wyrm's face and Bonecrow's back view could carry more personality; types (bible
proposal) need their own iteration; then the Home hub and the 5-tab navigation.
