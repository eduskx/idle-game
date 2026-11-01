/** How long the "new zone" banner stays up before it fades out on its own. */
export const ZONE_BANNER_MS = 2800;

/**
 * Remembers the last zone index any stage has shown and the banner that is currently due, so
 * the banner survives switching between the hub and the battle screen while it runs. A rebloom
 * (zone goes down) or the first render after launch (nothing seen yet) shows nothing.
 */
export function createZoneTracker() {
  let last: number | null = null;
  let pending: { zone: number; until: number } | null = null;
  return {
    /** Records `zone` and returns the banner to show now (zone + ms left), if any. */
    visit(zone: number, now: number = Date.now()): { zone: number; msLeft: number } | null {
      if (last !== null && zone > last) pending = { zone, until: now + ZONE_BANNER_MS };
      last = zone;
      if (!pending || pending.zone !== zone || now >= pending.until) {
        pending = null;
        return null;
      }
      return { zone, msLeft: pending.until - now };
    },
    /** The player tapped the banner away (or it ran out). */
    dismiss() {
      pending = null;
    },
  };
}

export const zoneTracker = createZoneTracker();
