import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string;
};

// GitHub Pages serves the app from /<repo>/. Override with BASE_PATH for other hosts.
const base = process.env.BASE_PATH ?? '/';

/**
 * PREVIEW=1 builds a single self-contained HTML file (no service worker, no CSP meta)
 * that can be shared as a phone preview without any hosting. See scripts/build-preview.mjs.
 */
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  base: preview ? './' : base,
  resolve: preview
    ? {
        alias: {
          'virtual:pwa-register/react': new URL('./src/preview/pwa-stub.ts', import.meta.url).pathname,
        },
      }
    : undefined,
  build: preview ? { outDir: 'dist-preview' } : undefined,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    preview && viteSingleFile(),
    !preview &&
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'Hollowbloom',
          short_name: 'Hollowbloom',
          description: 'An idle creature-battler of shadow and hearth.',
          theme_color: '#2b2140',
          background_color: '#1b1626',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '.',
          scope: '.',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
          cleanupOutdatedCaches: true,
        },
      }),
  ].filter(Boolean),
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
