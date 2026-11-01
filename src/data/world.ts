import type { CreatureLook, Element, EnemyDef, Realm, ZoneDef } from '../engine/types';

function enemy(
  id: string,
  realm: Realm,
  element: Element,
  hpMult: number,
  atkMult: number,
  look: CreatureLook,
): EnemyDef {
  return { id, realm, element, hpMult, atkMult, look };
}

export const ENEMIES: EnemyDef[] = [
  // Hearth wilds: mischievous rather than evil
  enemy('sproutling', 'hearth', 'grove', 1, 1, {
    body: 'blob',
    ears: 'leaf',
    eyes: 'dot',
    hue: 95,
    extra: 'none',
  }),
  enemy('puffcap', 'hearth', 'grove', 1.2, 0.8, {
    body: 'round',
    ears: 'none',
    eyes: 'sleepy',
    hue: 350,
    extra: 'mushroom',
  }),
  enemy('sparkbug', 'hearth', 'ember', 0.8, 1.3, {
    body: 'round',
    ears: 'antlers',
    eyes: 'big',
    hue: 55,
    extra: 'wings',
  }),
  enemy('pondtoad', 'hearth', 'tide', 1.3, 0.9, {
    body: 'wide',
    ears: 'none',
    eyes: 'big',
    hue: 140,
    extra: 'none',
  }),
  enemy('grumblebee', 'hearth', 'ember', 0.9, 1.2, {
    body: 'round',
    ears: 'antlers',
    eyes: 'dot',
    hue: 45,
    extra: 'wings',
  }),
  enemy('snailknight', 'hearth', 'tide', 1.6, 0.7, {
    body: 'wide',
    ears: 'antlers',
    eyes: 'sleepy',
    hue: 30,
    extra: 'none',
  }),
  enemy('thornfox', 'hearth', 'grove', 1, 1.2, {
    body: 'tall',
    ears: 'cat',
    eyes: 'dot',
    hue: 20,
    extra: 'tail',
  }),
  enemy('frostkit', 'hearth', 'tide', 0.9, 1.1, {
    body: 'round',
    ears: 'cat',
    eyes: 'big',
    hue: 195,
    extra: 'tail',
  }),
  enemy('candlewick', 'hearth', 'ember', 1.1, 1.1, {
    body: 'tall',
    ears: 'none',
    eyes: 'sleepy',
    hue: 40,
    extra: 'flame',
  }),
  // Hearth bosses
  enemy('bossGrandmushroom', 'hearth', 'grove', 1, 1, {
    body: 'tall',
    ears: 'none',
    eyes: 'sleepy',
    hue: 0,
    extra: 'mushroom',
  }),
  enemy('bossKettleGolem', 'hearth', 'ember', 1, 1, {
    body: 'wide',
    ears: 'horns',
    eyes: 'big',
    hue: 25,
    extra: 'flame',
  }),
  enemy('bossLakeSpirit', 'hearth', 'tide', 1, 1, {
    body: 'tall',
    ears: 'leaf',
    eyes: 'glow',
    hue: 200,
    extra: 'halo',
  }),

  // Umbra depths: properly spooky
  enemy('shade', 'umbra', 'ember', 0.9, 1.2, {
    body: 'blob',
    ears: 'none',
    eyes: 'glow',
    hue: 270,
    extra: 'none',
  }),
  enemy('ghoul', 'umbra', 'grove', 1.3, 1, {
    body: 'tall',
    ears: 'none',
    eyes: 'three',
    hue: 120,
    extra: 'none',
  }),
  enemy('drowner', 'umbra', 'tide', 1.1, 1.1, {
    body: 'wide',
    ears: 'horns',
    eyes: 'glow',
    hue: 180,
    extra: 'tail',
  }),
  enemy('bonehound', 'umbra', 'grove', 1, 1.3, {
    body: 'spiky',
    ears: 'cat',
    eyes: 'glow',
    hue: 50,
    extra: 'tail',
  }),
  enemy('cinderimp', 'umbra', 'ember', 0.8, 1.4, {
    body: 'round',
    ears: 'horns',
    eyes: 'glow',
    hue: 10,
    extra: 'wings',
  }),
  enemy('voidjelly', 'umbra', 'tide', 1.5, 0.8, {
    body: 'blob',
    ears: 'none',
    eyes: 'three',
    hue: 250,
    extra: 'none',
  }),
  enemy('hexspider', 'umbra', 'grove', 1, 1.2, {
    body: 'spiky',
    ears: 'none',
    eyes: 'three',
    hue: 300,
    extra: 'none',
  }),
  enemy('ashghast', 'umbra', 'ember', 1.2, 1.2, {
    body: 'tall',
    ears: 'none',
    eyes: 'glow',
    hue: 15,
    extra: 'flame',
  }),
  enemy('deepeel', 'umbra', 'tide', 1, 1.3, {
    body: 'tall',
    ears: 'none',
    eyes: 'dot',
    hue: 210,
    extra: 'tail',
  }),
  // Umbra bosses
  enemy('bossBoneTyrant', 'umbra', 'grove', 1, 1, {
    body: 'spiky',
    ears: 'antlers',
    eyes: 'glow',
    hue: 60,
    extra: 'halo',
  }),
  enemy('bossPyreQueen', 'umbra', 'ember', 1, 1, {
    body: 'tall',
    ears: 'horns',
    eyes: 'glow',
    hue: 350,
    extra: 'flame',
  }),
  enemy('bossLeviathan', 'umbra', 'tide', 1, 1, {
    body: 'wide',
    ears: 'horns',
    eyes: 'three',
    hue: 230,
    extra: 'tail',
  }),
];

export const ENEMY_BY_ID: Record<string, EnemyDef> = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

export function getEnemy(id: string): EnemyDef {
  const def = ENEMY_BY_ID[id];
  if (!def) throw new Error(`Unknown enemy: ${id}`);
  return def;
}

/**
 * Zones alternate between the cozy Hearth and the dark Umbra so both moods appear
 * early. After the last defined zone the list repeats with ever-growing numbers
 * ("Endless" cycles), so there is no hard progression ceiling.
 */
export const ZONES: ZoneDef[] = [
  {
    id: 'meadow',
    realm: 'hearth',
    enemies: ['sproutling', 'puffcap', 'sparkbug'],
    boss: 'bossGrandmushroom',
    palette: ['#b8e0a8', '#f7e7b4'],
  },
  {
    id: 'hollow',
    realm: 'umbra',
    enemies: ['shade', 'ghoul', 'cinderimp'],
    boss: 'bossBoneTyrant',
    palette: ['#2b2140', '#4b2f5a'],
  },
  {
    id: 'pond',
    realm: 'hearth',
    enemies: ['pondtoad', 'frostkit', 'puffcap'],
    boss: 'bossLakeSpirit',
    palette: ['#a6d8e8', '#e0f2e9'],
  },
  {
    id: 'crypt',
    realm: 'umbra',
    enemies: ['bonehound', 'hexspider', 'ghoul'],
    boss: 'bossBoneTyrant',
    palette: ['#1d1d2b', '#3a3550'],
  },
  {
    id: 'hearthtown',
    realm: 'hearth',
    enemies: ['candlewick', 'grumblebee', 'thornfox'],
    boss: 'bossKettleGolem',
    palette: ['#f3c99b', '#fbe8d0'],
  },
  {
    id: 'ashfields',
    realm: 'umbra',
    enemies: ['ashghast', 'cinderimp', 'shade'],
    boss: 'bossPyreQueen',
    palette: ['#3a1a1a', '#6b2d22'],
  },
  {
    id: 'orchard',
    realm: 'hearth',
    enemies: ['thornfox', 'snailknight', 'grumblebee'],
    boss: 'bossGrandmushroom',
    palette: ['#d7e8a2', '#f4d7c4'],
  },
  {
    id: 'drownedcity',
    realm: 'umbra',
    enemies: ['drowner', 'deepeel', 'voidjelly'],
    boss: 'bossLeviathan',
    palette: ['#10283a', '#1f3f55'],
  },
  {
    id: 'snowpeak',
    realm: 'hearth',
    enemies: ['frostkit', 'snailknight', 'candlewick'],
    boss: 'bossLakeSpirit',
    palette: ['#dfeaf5', '#ffffff'],
  },
  {
    id: 'abyss',
    realm: 'umbra',
    enemies: ['voidjelly', 'hexspider', 'deepeel'],
    boss: 'bossLeviathan',
    palette: ['#0b0b18', '#24163a'],
  },
  {
    id: 'starglade',
    realm: 'hearth',
    enemies: ['sparkbug', 'candlewick', 'sproutling'],
    boss: 'bossKettleGolem',
    palette: ['#2a3a6b', '#8a7bc8'],
  },
  {
    id: 'eclipse',
    realm: 'umbra',
    enemies: ['ashghast', 'bonehound', 'drowner'],
    boss: 'bossPyreQueen',
    palette: ['#1a0f1f', '#4a1030'],
  },
];

export function getZone(zoneIndex: number): ZoneDef {
  const zone = ZONES[zoneIndex % ZONES.length];
  if (!zone) throw new Error(`Invalid zone index: ${zoneIndex}`);
  return zone;
}

/** How many times the zone list has wrapped around (0 for the first pass). */
export function zoneCycle(zoneIndex: number): number {
  return Math.floor(zoneIndex / ZONES.length);
}
