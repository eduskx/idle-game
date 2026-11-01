// Renders public/favicon.svg to the PNG icons required by the PWA manifest.
// Requires Playwright (preinstalled in CI images or `npx playwright`); not a project dependency.
const { chromium } = require('playwright');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const svg = readFileSync(path.join(__dirname, '../public/favicon.svg'), 'utf8');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [name, size] of [
    ['icon-192.png', 192],
    ['icon-512.png', 512],
    ['apple-touch-icon.png', 180],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<html><body style="margin:0;background:#1b1626">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
    );
    await page.screenshot({ path: path.join(__dirname, `../public/${name}`), omitBackground: false });
  }
  await browser.close();
})();
