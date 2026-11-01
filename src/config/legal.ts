/**
 * Operator details for the imprint (Impressum) and privacy policy.
 *
 * TODO(owner): fill these in before promoting the game publicly or earning money
 * with it. See docs/LEGAL.md. Leave fields empty rather than inventing data:
 * the imprint page shows a notice while `name` is empty.
 */
export const LEGAL = {
  name: '',
  street: '',
  city: '',
  country: 'Deutschland',
  email: '',
  /** Hosting provider named in the privacy policy. */
  hostingProvider: 'GitHub Pages (GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA)',
  lastUpdated: '2026-11-01',
} as const;

export const APP_VERSION = __APP_VERSION__;
