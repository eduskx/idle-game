# Legal checklist (Germany) – not legal advice

This is a practical checklist for a hobby developer. Have a lawyer or your Chamber of Commerce (IHK) check it
before you earn money.

## Today (free, non-commercial, no data collection)

- ✅ **Privacy policy** in-game (More → Privacy). No tracking, no cookies, no external fonts/CDNs.
- ✅ localStorage use is _strictly necessary_ → no consent banner needed (§ 25 Abs. 2 Nr. 2 TDDDG).
- ✅ Hosting on GitHub Pages is mentioned (IP addresses in server logs, EU-US Data Privacy Framework).
- ✅ **Copyright**: all creatures, names, texts and placeholder art are original. Do not copy art, names or
  mechanics 1:1 from other games. "Inspired by the genre" is fine; cloning a specific game is not.
- ✅ Third-party licenses listed in-game (React, Zod, Workbox – all MIT; fonts Fredoka and Nunito – SIL OFL 1.1, self-hosted via Fontsource).
- ⚠️ **Imprint (Impressum)**: `src/config/legal.ts` is empty on purpose. As soon as the site is
  "geschäftsmäßig" (regularly offered, even free, especially with donation links or ads), § 5 DDG requires
  name, address and email. Fill in the config; the page renders automatically.

## Before taking money (donations, cosmetics, ads)

1. **Register a business** (Gewerbeanmeldung, ~20–60 €) or clarify "Kleinunternehmer" status (§ 19 UStG) with the tax office.
   ⚠️ This costs money, which is why nothing in this repository does it automatically.
2. **Imprint** filled in (see above). A c/o or virtual address service is possible if you do not want to publish your home address.
3. **Terms of service / AGB** and **right of withdrawal** for digital content (§ 356 Abs. 5 BGB: expiry only with explicit consent).
4. **Payment provider** (Stripe, Paddle, Ko-fi, GitHub Sponsors). Merchant-of-record providers (Paddle, Lemon Squeezy)
   handle EU VAT for you, which is strongly recommended for a solo developer.
5. Update the privacy policy for the payment provider (data processing, legal basis Art. 6 Abs. 1 lit. b DSGVO).
6. **No loot boxes for real money.** Summons are free (in-game essence only). Keep it that way: paid random items
   raise youth-protection (JuSchG § 10b) and gambling-law questions.
7. **Minors**: no targeted advertising, no dark patterns (fake timers, pressure purchases).

## App stores (optional, costs)

- Google Play: one-time 25 USD. Apple App Store: 99 USD/year. A PWA can be wrapped (e.g. Capacitor, TWA) later.
