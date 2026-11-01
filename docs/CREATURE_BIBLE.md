# Creature Bible – Hollowbloom

**Owner's vision (binding):** every creature must stand apart from all others in **shape, color,
personality, facial expression and size**. Not every creature is happy, not every creature has a
round body, not every creature is the same size. Think of a monster-tamer roster where you can tell
any two species apart by silhouette alone, in grayscale, at 48 px.

Every loop iteration starts by reviewing the creature art against this bible
(`npm run art -- <dir>` renders a contact sheet) and improves whatever falls short, before anything else.

## Diversity matrix

Each column must have **no duplicates** among the 10 creatures where marked (unique), and good spread otherwise.

| id            | Base                           | Shape language (unique)        | Dominant color (unique)   | Personality (unique) | Expression (unique)                                  | Size class | Type(s)       |
| ------------- | ------------------------------ | ------------------------------ | ------------------------- | -------------------- | ---------------------------------------------------- | ---------- | ------------- |
| mossling      | hedgehog with moss mantle      | low dome / mound               | moss green                | shy, timid           | worried brows, eyes peeking, tiny mouth              | S          | Grove + Stone |
| emberpup      | red-panda kit                  | pointed triangles (ears, tail) | fiery orange-red          | cocky, mischievous   | one-sided grin, single fang, squinted confident eyes | S          | Ember         |
| puddlefin     | river otter                    | long vertical oval, slender    | slate / river blue        | curious, dreamy      | wide round eyes, mouth "o", looking at its pebble    | M          | Tide          |
| teacup        | steam spirit in a teacup       | cylinder + curls               | porcelain white + amber   | sleepy, cozy         | half-closed eyes, yawn                               | XS (tiny)  | Tide + Ember  |
| honeybear     | bear cub in honeycomb armor    | big square block               | honey gold                | gentle giant, calm   | closed-eye content smile                             | L          | Grove + Gale  |
| gloomwisp     | flame in a lantern, moth wings | hexagon / lantern frame        | violet                    | melancholic          | droopy sad eyes, single tear                         | S          | Shade + Ember |
| bonecrow      | crow with skull mask           | thin spikes, sharp beak        | bone white on black       | sinister, smug       | narrow glowing eyes, head tilted                     | M          | Shade + Gale  |
| hexcat        | three-tailed cat               | slender S-curves               | emerald (flames) on black | arrogant, aloof      | half-lidded eyes, nose up, smirk                     | M          | Shade         |
| drownedknight | hermit crab in a knight's helm | rectangle / box                | rusted steel teal         | stoic, gruff         | only visor slits, no mouth                           | L          | Tide + Stone  |
| eclipsewyrm   | abyssal sea serpent            | spiral / S coil, longest       | deep navy + gold corona   | menacing, regal      | fierce narrow eyes, open maw with fangs              | XL         | Tide + Shade  |

## Size classes (rendered scale in battle and portraits)

| Class | Scale vs. M | Feel                              |
| ----- | ----------- | --------------------------------- |
| XS    | 0.6         | fits in a hand                    |
| S     | 0.8         | pet-sized                         |
| M     | 1.0         | reference                         |
| L     | 1.2         | heavy, fills the platform         |
| XL    | 1.35        | towers, may overflow the platform |

Implemented (iteration 2): `size` field in `src/data/creatures.ts`, `SIZE_SCALE` for the battle stage
(`<Sprite scale="stage">`) and a compressed `PORTRAIT_SCALE` (0.7–1) for fixed portrait slots.

## Types (implemented in iteration 3)

Six types, each creature has one or two (column "Type(s)" above). Enemies inherit their species' types.

| Type (en / de)   | Color   | Icon            | Strong against (×1.5) | Resisted by (×0.75) |
| ---------------- | ------- | --------------- | --------------------- | ------------------- |
| Ember / Glut     | #ff7a3c | flame           | Grove, Gale           | Tide, Stone         |
| Tide / Flut      | #45b4ff | drop over wave  | Ember, Stone          | Grove, Gale         |
| Grove / Hain     | #6fd16a | leaf            | Tide, Stone           | Ember, Shade        |
| Stone / Fels     | #b8a07a | faceted boulder | Ember, Gale           | Tide, Grove         |
| Gale / Sturm     | #9fe3ff | three swooshes  | Tide, Shade           | Ember, Stone        |
| Shade / Schatten | #a77bff | crescent + star | Shade, Grove          | Gale                |

Rules: "resisted by" is always the mirror of "strong against", so every type has exactly two strengths
and (except Shade) two weaknesses. Shade hits Shade hard both ways. Changed from the first proposal:
Gale is strong against Tide instead of Grove (Grove had three weaknesses, Tide only one).
The attacker strikes with its best type; the defender's types multiply
(×1.5 · ×1.5 = ×2.25, ×0.75 · ×0.75 ≈ ×0.56). Chart and tests: `src/engine/formulas.ts`
(`TYPE_STRONG`, `typeEffect`, `typeMultiplier`). UI: `src/ui/components/TypeChip.tsx`.

## Art rules

- Vector SVG in `src/ui/creatures/<id>.tsx`, `front` and `back` views, named `<g>` parts.
- Max ~3 main colors (60/30/10) plus eyes and outline; outline tinted dark per creature.
- Signature feature per creature must survive at 48 px.
- Checks per creature: black silhouette distinct, grayscale distinct, 48 px readable.
- Eyes/mouth carry the personality: vary eye shape (round, slit, half-lidded, slits only, glowing),
  brows, mouth (grin, frown, yawn, none, fangs). Avoid the same "big glossy eyes + smile" everywhere.
- Back views must match the front silhouette and size.
