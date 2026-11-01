// Builds dist-preview/hollowbloom.html: the whole game as one HTML fragment
// (no doctype/head wrapper, no CSP meta, no service worker) for a shareable phone preview.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

execSync('vite build', { stdio: 'inherit', env: { ...process.env, PREVIEW: '1' } });
const html = readFileSync('dist-preview/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*)<\/head>/)?.[1] ?? '';
const body = html.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? '';
const keep = head
  .replace(/<meta charset[^>]*>/i, '')
  .replace(/<meta name="viewport"[^>]*>/i, '')
  .replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>/i, '')
  .replace(/<link rel="(icon|apple-touch-icon|manifest)"[^>]*>/gi, '');
const out = `<title>Hollowbloom</title>\n<style>html,body{background:#1b1626}</style>\n${keep}\n${body}`;
writeFileSync('dist-preview/hollowbloom.html', out);
console.log(`dist-preview/hollowbloom.html (${(out.length / 1024).toFixed(0)} KB)`);
