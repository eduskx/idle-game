# Cloud save – plan for later

The game talks only to `SaveRepository` (`src/persistence/repository.ts`). Adding cloud sync means writing one class.

## Recommended free option: Supabase (free tier)

- Auth: magic-link email or anonymous sign-in + optional email linking.
- Table `saves (user_id uuid primary key references auth.users, data jsonb, version int, updated_at timestamptz)`.
- **Row Level Security**: `user_id = auth.uid()` for select/insert/update. Never ship the service-role key to the client.
- Conflict handling: keep the save with the higher `lifetime.playSeconds` or ask the player.

## Consequences

- Privacy policy must list Supabase as processor (choose the EU region, sign the DPA).
- An account means personal data → right to deletion (add "delete account" button).
- Free projects are paused after a week of inactivity; fine for a hobby game, not for a large player base.
- The CSP `connect-src` must allow the Supabase URL.

## Anti-cheat

Client saves can always be edited. For leaderboards later, validate on the server by re-running the
deterministic engine (it is pure TypeScript and can run in an Edge Function).
