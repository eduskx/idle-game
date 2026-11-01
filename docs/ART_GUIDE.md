# Art guide – replacing placeholder art

The 10 creatures are hand-drawn SVG components in `src/ui/creatures/<id>.tsx`, each with a `front`
view (enemies, portraits) and a `back` view (your own creature in battle). Enemies are wild/alpha
members of the same species. Run `npm run art -- <out-dir>` to render a contact sheet of all of them.

Custom art replaces them **without code changes**:

1. Export the creature as **SVG** (preferred), **PNG** or **WebP**, square, transparent background, at least 256×256 px.
2. Name the file exactly like the id, e.g. `mossling.svg` (front) and `mossling-back.svg` (back view)
   (ids are in `src/data/creatures.ts`).
3. Put it into `src/assets/creatures/`.
4. Run `npm run build`. The override is picked up automatically.

## Style direction

- **Hearth**: warm pastel, soft outlines, cozy and readable at 48 px. Not every Hearth creature is round or happy:
  shape, expression and size follow the diversity matrix in `CREATURE_BIBLE.md`.
- **Umbra**: desaturated purples/teals, glowing eyes, sharper silhouettes, a little creepy but never gory.
- Both realms should feel like they belong to the same world (same outline thickness, same lighting direction).
- Facing: front views look at the viewer, slightly turned left; back views show the creature from behind, facing up-right.

## Copyright

Only use art you created yourself or that you hold a written license for. If someone else draws for the game,
get a short written agreement (email is fine) that grants you the rights to use it in the game, also commercially.
