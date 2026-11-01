/**
 * Deterministic PRNG (mulberry32). The state lives in the save file, so rolls are
 * reproducible: reloading a save does not let a player re-roll a summon.
 */
export function nextRandom(state: number): [value: number, nextState: number] {
  let t = (state + 0x6d2b79f5) | 0;
  const next = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [value, next];
}

/** Mutable helper bound to a GameState-like object holding `rngState`. */
export function roll(holder: { rngState: number }): number {
  const [value, next] = nextRandom(holder.rngState);
  holder.rngState = next;
  return value;
}

export function randomSeed(): number {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    return crypto.getRandomValues(new Uint32Array(1))[0]! | 0;
  }
  return (Math.random() * 2 ** 32) | 0;
}
