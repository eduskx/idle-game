# Art guide – replacing placeholder art

All creatures and enemies are drawn procedurally in `src/ui/components/Sprite.tsx` as placeholders.
Custom art replaces them **without code changes**:

1. Export the creature as **SVG** (preferred), **PNG** or **WebP**, square, transparent background, at least 256×256 px.
2. Name the file exactly like the id, e.g. `mossling.svg`, `bossPyreQueen.png`
   (ids are in `src/data/creatures.ts` and `src/data/world.ts`).
3. Put it into `src/assets/creatures/`.
4. Run `npm run build`. The override is picked up automatically.

## Style direction

- **Hearth**: warm pastel, round shapes, blush cheeks, big eyes, soft outlines. Cozy, Ghibli-ish, readable at 48 px.
- **Umbra**: desaturated purples/teals, glowing eyes, sharper silhouettes, a little creepy but never gory.
- Both realms should feel like they belong to the same world (same outline thickness, same lighting direction).
- Facing: creatures face **right**; enemies are mirrored automatically.

## Copyright

Only use art you created yourself or that you hold a written license for. If someone else draws for the game,
get a short written agreement (email is fine) that grants you the rights to use it in the game, also commercially.
