import { describe, expect, it } from 'vitest';
import { createZoneTracker, ZONE_BANNER_MS } from './zoneArrival';

describe('zone arrival banner', () => {
  it('stays quiet on the first render after launch', () => {
    const t = createZoneTracker();
    expect(t.visit(3, 0)).toBeNull();
  });

  it('fires when a further zone is reached and keeps running across screens', () => {
    const t = createZoneTracker();
    t.visit(0, 0);
    expect(t.visit(0, 100)).toBeNull();
    expect(t.visit(1, 1000)).toEqual({ zone: 1, msLeft: ZONE_BANNER_MS });
    // the hub unmounts, the battle screen mounts a moment later: same banner, less time left
    expect(t.visit(1, 1500)).toEqual({ zone: 1, msLeft: ZONE_BANNER_MS - 500 });
    expect(t.visit(1, 1000 + ZONE_BANNER_MS)).toBeNull();
  });

  it('can be skipped', () => {
    const t = createZoneTracker();
    t.visit(0, 0);
    t.visit(1, 10);
    t.dismiss();
    expect(t.visit(1, 20)).toBeNull();
  });

  it('stays quiet when a rebloom sends the team back', () => {
    const t = createZoneTracker();
    t.visit(4, 0);
    expect(t.visit(0, 10)).toBeNull();
    expect(t.visit(1, 20)?.zone).toBe(1);
  });
});
