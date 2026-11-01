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

## Iteration 3 – Type system and weak views

Review: the 3-element triangle (Ember/Tide/Grove) didn't match the bible's six types, a creature's
type was only a 10 px color dot, and four views were weak (see Art below).

- **Six types** (Glut, Flut, Hain, Fels, Sturm, Schatten) replace the element triangle in the engine.
  Species have one or two types per the bible matrix; wild and alpha enemies inherit them. The attacker
  uses its best type, defender types multiply (up to ×2.25 / down to ×0.56). One fix to the proposal:
  Gale now beats Tide instead of Grove so every type has two strengths and two weaknesses. Tests cover
  the chart, its symmetry, dual types and inheritance. `npm run simulate` pacing is about the same
  (stage 400 after ~31 h vs ~34 h before).
- **Type chips** with their own 16 px glyphs (flame, drop+wave, leaf, boulder, wind, crescent) in the
  battle info boxes, on team cards, in summon results and the summon pool (icon-only there).
- **Effectiveness callout:** "Sehr effektiv!" / "Nicht sehr effektiv…" pops above the target once per
  matchup (refreshed every 6 s, never spammy); damage numbers are tinted gold / grey accordingly.
  Reduced motion gets a plain fade.
- **Save compatibility:** charm ids are unchanged; element cores now boost every creature that has the
  matching type (Mossling gets the Grove core as Grove+Stone). Tested with a pre-type save.
- **Art:** Eclipse Wyrm got a wide wedge skull, heavy angled brow ridges, narrow gold slit eyes, a
  dropped jaw with four fangs and a bigger corona that frames the head. Bonecrow's back view keeps the
  cocked head, so the beak tip, mask rim and one glowing slit peek out; the mask strap is knotted at
  the back, wings have spiky tips. Emberpup's tail now swings out to the side instead of crossing the
  back, and its ears show their dark backs. Honeybear's back shows the honey cap with rounded drips
  (no more crack look). `npm run art` now creates its output folder.

Next: Home hub + slimmer navigation (5 tabs), a matchup hint in the team screen (which member is
strong against the current zone), then the avatar.
