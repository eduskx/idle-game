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

## Iteration 4 – Home hub, 5-tab navigation, realm themes and fonts

Review: the art sheet still holds up against the bible (silhouettes, colors, faces and sizes all
distinct). Weakest views remain the backs of Puddlefin (plain blob) and Drowned Knight; not touched
this time. The bigger problem was structure: the game opened straight into the battle, six nav tabs
were crammed side by side, and nothing showed the team as "yours".

- **Home hub** is the new start screen: a 2.5D scene in the current zone's palette with the team in
  front view, staggered in depth (leader up front, others smaller and dimmer behind, own idle bob
  per member), a big primary CTA "Weiterkämpfen · Stufe X · Zone", and three status cards: zone
  progress (+ stages to the next boss), expeditions (away / ready / idle) and Rebloom (ready + seeds).
  Locked features stay visible as dashed cards with their condition and a progress bar
  ("Ab Stufe 25 freigeschaltet"). A dashed placeholder marks where the avatar will stand.
- **5 tabs:** Home · Team · Beschwören · Upgrades · Mehr. Battle and Rebloom open from the hub,
  Expeditions from the hub card or Team; sub-screens get a "‹ Home/Team" back button and keep their
  parent tab highlighted. Active tab = filled pill. Only badge left: Team dot when an expedition is
  actually ready.
- **Saved tab:** `parseStoredTab` (`src/ui/navigation.ts`, tested) maps legacy ids `battle` and
  `rebloom` to Home, `expeditions` to Team, and anything unknown to Home.
- **Realm themes:** `data-realm` on `<html>` follows the current zone. Hearth = warm cream surfaces,
  cocoa text, apricot primary; Umbra = ink violet, ghost-violet primary, spectral-mint accent.
  Hard-coded chip/track/tab colors became tokens; rarity colors are darker on light surfaces.
  `theme-color` follows the realm.
- **Fonts:** Fredoka (headings, numbers, nav) and Nunito (body), SIL OFL 1.1, self-hosted from the
  Fontsource npm packages; only the Latin subset is bundled (~69 KB total). Licenses listed in Legal.
- Toasts show at most two at a time so a burst of achievements doesn't cover the hub.

Next: Puddlefin and Drowned Knight back views; hub juice (tap a creature for a reaction); a matchup
hint in Team (who is strong against the current zone); then the avatar.

## Iteration 5 – Player avatar, wardrobe and hub reactions

Review: the art sheet still meets the bible. The weakest views were the backs of Puddlefin (plain
blue blob) and Drowned Knight (flat helm). The hub had only a dashed "avatar coming soon" box.

- **Player avatar (paper-doll):** hand-drawn layered SVG in the creature style (`src/ui/avatar/`):
  one shared chibi pose (viewBox 200×300), fixed layers (hood → back hair → legs → bottoms → shoes →
  torso → top → hands → neck accessory → head/face → front hair → hat → face accessory). Hair is split
  into back and front parts; hats hide the bun. Skin, hair and clothing colors are CSS variables
  (`--av-skin`, `--av-hair`, `--av-<slot>-1/2/3`).
- **Wardrobe:** 23 pieces in six slots (hair, top, bottoms, shoes, hat, extra), each slot with a
  Hearth piece (knit sweater, bobble hat, patchwork skirt, felt slippers, scarf, bun) and an Umbra
  piece (spectral hood, crescent hat, night wrap, claw boots, moth brooch, night veil). 6 skin tones and
  8 hair colors are free. Everything else unlocks through existing milestones (achievements, highest
  stage, reblooms); no shop, no costs. Locked pieces show a silhouette, the condition and progress.
  A toast announces new pieces.
- **Hub:** the avatar stands front-left in the scene (tap → wardrobe), the team moved right.
  Tapping a creature plays a personality reaction with an emote: Mossling ducks and trembles,
  Emberpup hops, Puddlefin tilts its head, Teacup dozes, Honeybear squishes, Gloomwisp droops,
  Bonecrow snaps its head, Hexcat turns away, Drowned Knight clanks, Eclipse Wyrm rears up.
  Reduced motion keeps only the emote.
- **Save v3:** `avatar` (skin, hair color, item per slot). Migration v2→v3 adds the default outfit;
  loading repairs unknown/locked items and out-of-range colors. Tests for migration, round trip,
  repair, unlocks and wardrobe data.
- **Art:** Puddlefin's back has a dark dorsal stripe, wet fur tufts, darker ear backs, elbows hugging
  the pebble, whiskers past the cheeks, a mirrored lily pad and a thick ringed tail. Drowned Knight's
  back has a riveted comb ridge, a dented neck guard with rust runs, a barnacle colony, both claws
  peeking out and the red crab abdomen curling out under the rim.
- `npm run art` now also renders avatar outfits (default, both realm sets, every piece).

Next: locked wardrobe tiles could show only the piece instead of a full silhouette; show the avatar
small in the battle stage (back view needed); matchup hint in Team.

## Iteration 6 – Personality idles, summon reveal and matchup hints

Review: the art sheet still meets the bible (shape, color, face and size are distinct for all 10).
Weakest view this time was Emberpup's back: a plain orange ball. The bigger gap was motion: every
creature idled with the same breathe, so personality only lived in the still drawings.

- **Personality idles** (hub, battle, summon reveal): each species has its own whole-body keyframes on
  the svg plus part animations on named groups (`cr-*` classes in the art, view-box origins in user
  units). Mossling breathes, then ducks into its moss and trembles while a sweat drop runs down;
  Emberpup bounces cockily, its tail swishes and the tail flame flickers; Puddlefin tilts its head
  dreamily and its pebble glimmers; Teacup nods off and jerks awake while the steam rises and the
  z's drift up; Honeybear rocks slowly while its bees buzz; Gloomwisp rises, then sags and dims, wings
  beating; Bonecrow's head snaps from pose to pose (steps timing); Hexcat sits still while the three
  tails whip one after another; Drowned Knight stays almost motionless, only the visor glow
  smoulders; Eclipse Wyrm's neck winds and the corona pulses. Only transform/opacity; everything is
  gated by `data-motion='full'`, so reduced motion keeps the creatures still. Back views carry the
  same parts, so the own monster in battle moves in character too.
- **Summon reveal:** full-screen sequence: the circle charges (rarer = longer), flashes in the rarity
  color, then the creature hops out with rarity, name, type chips and New/Star/Shard tag. ×10
  reveals one after another (counter "3 / 10"), tap advances, "Alle zeigen"/"Überspringen" jumps to
  the result grid. Not shown with reduced motion. Timing in `src/ui/summonReveal.ts` (tested).
- **Matchup hint in Team:** "Gegner in <Zone>:" lists the zone's enemy types; cards get "▲ Stark in
  dieser Zone" / "▼ Schwach in dieser Zone". Score = average damage multiplier dealt to the zone's
  species (incl. boss) ÷ average taken; ≥ 1.15 strong, ≤ 0.87 weak (`src/engine/matchup.ts`,
  tested; thresholds give every label across the roster).
- **Button feedback:** deeper press (scale + slight drop + dim, primary brightens) and a springy
  release; nav buttons squeeze on press.
- **Art:** Emberpup's back shows white cheek ruffs past the head and a darker saddle down the back.

Next: the hub leader (Eclipse Wyrm XL) hides members behind it, so the hub layout should space by
size class; the small summon circle on the Summon screen looks like a blank blob and should become a
real 2.5D circle; locked wardrobe tiles could show only the piece.

## Iteration 7 – Hub depth by size, 2.5D summoning circle, wardrobe silhouettes, card polish

Review: the art sheet still meets the bible. Weakest view was Teacup's back (a plain amber egg).
On screen, the hub was the biggest problem: the leader stood front-center at full size, so an
Eclipse Wyrm (XL) covered half the team and Drowned Knight vanished behind it.

- **Hub layout by size class** (`src/ui/hubLayout.ts`, tested): the team stands like a group photo.
  Members are sorted by size class, the biggest get the back row (central slots first), the smallest
  stand in front. Slot sets for 1–6 members (2 or 3 rows, staggered), back rows are smaller
  (perspective), rows are far enough apart that a creature right in front covers at most the lower
  third of the one behind it, and within a row the smaller creature is drawn on top. Sprites are
  clamped inside the scene. Team slot 1 (who fights first) gets a small ★ badge at its feet instead of
  the front spot. Tests cover order, depth rule, z-order, bounds and overlap for seven mixed teams.
- **Summoning circle** (`SummonCircle.tsx`): a rune ring on a stone slab in real perspective
  (`rotateX(64deg)`), with the six type glyphs in their colors set in sockets, six original runes,
  a double hexagram, a light column and rising motes. Idle: rune band turns, star counter-turns, glow
  breathes. On the Summon screen it glows in the best rarity currently in the pool; the reveal reuses
  it in the rarity color and spins it up while charging. Replaces the dashed blob and the flat rings.
- **Wardrobe:** locked tiles show only the piece itself as a silhouette (no avatar body, `Avatar
only=<slot>`), the condition and progress; the name stays for screen readers only.
- **Team cards:** 96 px portrait on a gradient of the creature's types (dual types blend), name in
  the display font, "Rarity · Realm" as one colored line instead of two chips, level with bar on one
  line, ATK/HP/SPD as three stat tiles. Less text noise, clearer hierarchy.
- **Upgrade cards:** icon on a colored tile per upgrade (attack red, life green, gold, XP blue …),
  tighter text, wide buy button; maxed cards fade.
- **Art:** Teacup's back shows a tea swirl, the leaf from behind, a drifting "z", a tea bag tag over
  the rim and a small chip in the cup (the "uncool flaw").

Next: the brooch silhouette in the wardrobe is tiny (crop per piece instead of per slot); Summon pool
tiles could use the same type-tinted portrait as Team; Hexcat's back is still a dark blob.

## Iteration 8 – Hexcat's back, the tamer in battle, theme contrast, pool portraits

Review: the art sheet still meets the bible for shape, color, face and size. The weakest view was
Hexcat's back: a black blob with no outline on its tails, unreadable in grayscale. The other backs
were checked against silhouette, grayscale and 48 px and hold up; Emberpup's back is still the plainest.

- **Hexcat back:** an emerald rim light thrown by the tail flames (a crescent, stronger on the right),
  emerald ear insides peeking past the ear backs, the gold collar with a buckle over the nape, haunches,
  a faint hex sigil in the fur and three outlined tails with a lit edge curling out to both sides.
  It now reads in grayscale and at 48 px. The tail whip idle keeps working (same `cr-tail-*` groups).
- **Avatar back view** (`<Avatar view="back">`): new head from behind, hair from behind for all five
  styles (crown whorl, bob strands, braids with parting, bun, long veil), tops from behind (the shroud's
  hood covers the hair, the cape falls over the back), the crescent hat without its emblem, glasses as
  temple arms, the scarf with one end down the back, the brooch hidden. Bottoms and shoes are reused.
  The art sheet now shows every outfit front and back.
- **Tamer in battle:** your avatar stands small, seen from behind, in the front-left corner next to
  your monster (over-the-shoulder), breathing with it. In Umbra a faint moonlit rim keeps dark
  outfits readable. The monster moved 22 px right to make room.
- **Alpha crown bug:** `.sprite > svg` outranked `.alpha-crown`, so the boss crown was blown up to
  the full sprite size and covered the face. Fixed; the crown no longer breathes with the art.
- **Theme contrast (WCAG AA):** a scripted audit of every screen (text vs. effective background,
  opacity included) found no Umbra text below AA, but control borders at 1.5:1. New `--control-line`
  token (≥ 3:1 against cards, WCAG 1.4.11) for buttons and tabs in all themes. Hearth had real text
  failures, fixed at the same time: accent green, rare/legendary/common rarity colors, the Hearth realm
  label and the active nav label (now `--nav-active`) are darker. Remaining audit hits are false
  positives (gradient logo, outlined damage numbers, disabled buttons).
- **Summon pool tiles:** the same type-tinted portrait as the Team cards (shared `.type-portrait-bg`).
  Locked species are a black silhouette on a neutral tile; the unlock hint is no longer darkened to
  unreadable by a brightness filter on the whole tile.
- **Wardrobe:** locked pieces are cropped to the piece itself (`PIECE_VIEWBOX`, measured bounding
  boxes), so the brooch, the sprout and the shoes fill their tiles. Tests cover back pieces for every
  item and the crops.

Next: Emberpup's back could read stronger (tail rings from behind); the tamer could react to wins and
boss fights; Hearth damage numbers need a darker outline on light skies.

## Iteration 9 – Emberpup's tail from behind, Honeybear's arms, tamer reactions, Dependabot

Review: the art sheet still meets the bible for shape, color, face and size. Two weak spots:
Emberpup's back hid the tail behind the body (only a thin strip with two faint rings), and Honeybear's
front was a box with a head and no arms.

- **Emberpup back:** the tail now grows from the rump in front of the body (it is the part closest to
  the camera), sweeps out to the left past the head and ends in a glowing coal tip with a flame and
  sparks. Three bold dark rings (clipped to the tail) and a lit outer edge read at 48 px. Own idle
  classes `cr-tail-back` / `cr-flame-back` with matching origins (swish + flicker).
- **Honeybear front:** arms that hug the block: the left hangs at the side with a pale-padded paw
  and blunt claws, the right paw rests on the belly (calm gentle giant). The square silhouette stays.
  The back view gets matching arm backs so both views share one silhouette.
- **Tamer reactions** (`src/ui/tamerReaction.ts`, tested): a cleared stage → two happy hops and a
  sparkle; a beaten boss → a big leap with a wiggle and a gold star burst; a defeat or failed boss →
  recoil, shake and a sweat drop. A loss outranks a win in the same tick; hits and kills get no
  reaction (they come every second). During boss fights the tamer leans in and eggs the monster on
  (`.trainer.rally`). Reduced motion: no body motion, the emote only fades in and out.
- **Damage numbers in Hearth:** heavier, darker outline (4.5 px) plus a dark halo on the light skies;
  "weak" numbers get a lighter fill so they keep contrast against the outline.
- **Dependabot:**
  - #5 `actions/setup-node` 4 → 7: CI green, only the action version changed → merged.
  - #2 `actions/deploy-pages` 4 → 5 and #3 `actions/upload-pages-artifact` 3 → 5: only used by the
    manual Pages workflow (not run by CI); they are a matched pair, the build output has no dotfiles
    that the newer upload would drop → merged together.
  - #4 `actions/checkout` 4 → 7: CI green, but it conflicted with #5 (adjacent line) after that
    merge, so the bump is applied in this iteration's PR, where CI exercises it; Dependabot closes
    #4 on its own once main has v7.
  - #6 `typescript` 6 → 7: CI red at `npm ci`: `typescript-eslint@8.72.1` requires
    `typescript <6.1.0`. A major update with no concrete benefit yet → closed with a comment.
    Revisit when typescript-eslint supports TS 7.

Next: the tamer could also react when a new creature is summoned on the Summon screen; Puddlefin's
back is now the plainest view on the sheet; check the hub's leader spacing with Honeybear's wider
silhouette.

## Iteration 10 – a world per zone, the zone-arrival banner, upgrade cards

Review: the art sheet still meets the bible for shape, color, face and size; no creature showed a
clear weakness this round (Puddlefin's back, flagged last time, already carries the ringed tail,
dorsal stripe, tufts and pebble glow and reads at 48 px), so the iteration went into the worlds.

- **Zone scenery** (`src/ui/components/ZoneScenery.tsx`, replaces `Backdrop.tsx`): every one of the
  12 zones has its own backdrop, in the battle stage and the home hub. Layers: sky (sun, moon,
  stars, light rays), a far and a mid band that drift against each other (ambient parallax, 70 s /
  44 s), flat ground decor on the perspective floor, a per-zone floor texture and a small particle
  pool (3–10 spans). Landmarks: windmill with turning sails and a fence (Butterblumenwiese), dead
  trees and fog (Flüstersenke), water, reeds, a jetty and lily pads with ripples (Seerosenteich),
  mausoleum, iron fence and gravestones with will-o'-wisps (Versunkene Gruft), cottages with
  chimney smoke and a lantern string (Herdhausen), a glowing volcano, charred stumps, lava cracks
  and embers (Aschefelder), skep beehives, sunflowers, an apple tree and bees (Honiggarten), sunken
  towers, a toppled column, swaying kelp and bubbles (Ertrunkene Stadt), snowy peaks, pines, the
  cocoa hut and snowfall (Kakaogipfel), floating rock islands over a void with twinkling stars
  (Der Abgrund), glowing mushrooms and fireflies (Sternenlichtung), the eclipse, spires, banners
  and the throne on its dais (Finsternisthron). The bands keep their aspect ratio (no squashed
  shapes on wide screens). Only transform/opacity animate, all gated by `data-motion='full'`.
  Sternenlichtung is a night-time Hearth zone, so its labels switch to light text.
- **Zone-arrival banner** (`ZoneBanner.tsx`, logic in `src/ui/zoneArrival.ts`, tested): reaching a
  new zone shows a ribbon with "New zone · realm · zone n" and the zone name for 2.8 s. Tap skips
  it. It survives switching between hub and battle while it runs; a rebloom or a fresh launch shows
  nothing. Reduced motion: no slide, it just appears and goes.
- **Upgrade cards:** own two-tone SVG icons instead of emojis (claw slashes, steaming bowl, pouch
  with coin, scroll, target, gusts, paw), an effect line "now → after the next level" (×2.40 →
  ×2.60, +7% → +8%, +1 → +2) and, for the four multiplier upgrades, a progress bar to the next ×2
  milestone ("×2 at Lv 25 · 18 to go", highlighted one level before). Logic in
  `src/ui/upgradeView.ts` (tested, mirrors `engine/stats.ts`).

Next: the hub team stands in front of the mid band, so some landmarks (throne, hut) hide behind
the creatures there; a subtle depth fade or moving the landmarks to the flanks could help. The
currency pills still use emojis; own coin/essence/seed icons would match the new upgrade icons.
