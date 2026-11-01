# Security Policy

Hollowbloom is a client-only game: there is no backend, no account system and no
personal data. Still, please report anything that could harm players (e.g. a
crafted save code that runs script, or a supply-chain issue in a dependency).

**Report privately** via GitHub's "Report a vulnerability" (Security tab) instead of
opening a public issue. You will get a reply within 14 days.

## Measures in place

- Strict Content Security Policy (no inline scripts, no third-party origins).
- No `dangerouslySetInnerHTML` / `eval` (enforced by ESLint).
- Every save and import string is validated with a Zod schema (types, ranges, size limit).
- Deterministic RNG state stored in the save to prevent summon re-roll by reloading.
- `npm audit` on production dependencies in CI, Dependabot for updates.
- GitHub Actions run with least-privilege `permissions`.
