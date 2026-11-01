/**
 * Renders every creature (front + back, two sizes) into an HTML contact sheet and a PNG.
 * Usage: npx tsx scripts/art-sheet.tsx <out-dir>
 * Used during development to review art quickly without running the app.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AVATAR_ITEMS, DEFAULT_AVATAR } from '../src/data/avatar';
import type { AvatarState } from '../src/engine/types';
import { Avatar } from '../src/ui/avatar/Avatar';
import { CREATURE_ART } from '../src/ui/creatures';

const out = process.argv[2] ?? '.';
const cells = Object.entries(CREATURE_ART)
  .map(([id, Art]) => {
    const front = renderToStaticMarkup(createElement(Art, { uid: `${id}f`, view: 'front' }));
    const back = renderToStaticMarkup(createElement(Art, { uid: `${id}b`, view: 'back' }));
    const small = renderToStaticMarkup(createElement(Art, { uid: `${id}s`, view: 'front' }));
    return `<div class="cell"><div class="row"><div class="big">${front}</div><div class="big">${back}</div><div class="small">${small}</div></div><p>${id}</p></div>`;
  })
  .join('');
// Avatar outfits: the default, every item once (on top of the default) and the two realm sets.
const base: AvatarState = {
  skin: DEFAULT_AVATAR.skin,
  hairColor: DEFAULT_AVATAR.hairColor,
  items: { ...DEFAULT_AVATAR.items },
};
const outfit = (
  items: Partial<AvatarState['items']>,
  skin = base.skin,
  hairColor = base.hairColor,
): AvatarState => ({
  skin,
  hairColor,
  items: { ...base.items, ...items },
});
const outfits: AvatarState[] = [
  base,
  outfit(
    { hair: 'bun', top: 'knit', bottom: 'patchskirt', shoes: 'slippers', hat: 'bobble', accessory: 'scarf' },
    0,
    3,
  ),
  outfit(
    {
      hair: 'veil',
      top: 'shroud',
      bottom: 'nightwrap',
      shoes: 'clawboots',
      hat: 'crescent',
      accessory: 'mothpin',
    },
    4,
    4,
  ),
  ...AVATAR_ITEMS.filter((i) => i.id !== 'none').map((i, n) => outfit({ [i.slot]: i.id }, n % 6, n % 8)),
];
const avatars = outfits
  .map((a) => `<div class="av">${renderToStaticMarkup(createElement(Avatar, { avatar: a }))}</div>`)
  .join('');

const html = `<!doctype html><html><head><style>
body{margin:0;background:#2a2238;font-family:sans-serif;color:#eee;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:8px;width:1000px}
.cell{background:linear-gradient(#cfe8c0,#f3e7c4);border-radius:12px;padding:6px}
.cell:nth-child(n+6){background:linear-gradient(#2d2442,#4a3160)}
.avatars{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:6px;background:linear-gradient(#f3e7c4,#cfe8c0);border-radius:12px;padding:6px}.av svg{width:120px;height:180px}
.row{display:flex;align-items:flex-end;gap:6px}.big svg{width:200px;height:200px}.small svg{width:56px;height:56px}
p{margin:0;text-align:center;color:#222;font-weight:700}.cell:nth-child(n+6) p{color:#eee}
</style></head><body>${cells}<div class="avatars">${avatars}</div></body></html>`;
mkdirSync(out, { recursive: true });
writeFileSync(`${out}/sheet.html`, html);

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1016, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: `${out}/sheet.png`, fullPage: true });
await browser.close();
console.log(`wrote ${out}/sheet.png`);
