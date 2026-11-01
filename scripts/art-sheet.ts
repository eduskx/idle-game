/**
 * Renders every creature (front + back, two sizes) into an HTML contact sheet and a PNG.
 * Usage: npx tsx scripts/art-sheet.tsx <out-dir>
 * Used during development to review art quickly without running the app.
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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
const html = `<!doctype html><html><head><style>
body{margin:0;background:#2a2238;font-family:sans-serif;color:#eee;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:8px;width:1000px}
.cell{background:linear-gradient(#cfe8c0,#f3e7c4);border-radius:12px;padding:6px}
.cell:nth-child(n+6){background:linear-gradient(#2d2442,#4a3160)}
.row{display:flex;align-items:flex-end;gap:6px}.big svg{width:200px;height:200px}.small svg{width:56px;height:56px}
p{margin:0;text-align:center;color:#222;font-weight:700}.cell:nth-child(n+6) p{color:#eee}
</style></head><body>${cells}</body></html>`;
writeFileSync(`${out}/sheet.html`, html);

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1016, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: `${out}/sheet.png`, fullPage: true });
await browser.close();
console.log(`wrote ${out}/sheet.png`);
