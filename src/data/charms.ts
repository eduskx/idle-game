import type { Element } from '../engine/types';

export type CharmId =
  | 'wolfFang'
  | 'amberHeart'
  | 'luckyClover'
  | 'owlFeather'
  | 'moonstone'
  | 'hourglass'
  | 'emberCore'
  | 'tideCore'
  | 'groveCore';

export interface CharmDef {
  id: CharmId;
  icon: string;
  /** Effect per level. */
  perLevel: number;
  maxLevel: number;
  element?: Element;
}

/** Charms drop from bosses and expeditions and are kept forever (also through rebloom). */
export const CHARMS: CharmDef[] = [
  { id: 'wolfFang', icon: '🦷', perLevel: 0.05, maxLevel: 100 },
  { id: 'amberHeart', icon: '🧡', perLevel: 0.05, maxLevel: 100 },
  { id: 'luckyClover', icon: '🍀', perLevel: 0.04, maxLevel: 100 },
  { id: 'owlFeather', icon: '🪶', perLevel: 0.04, maxLevel: 100 },
  { id: 'moonstone', icon: '🌙', perLevel: 0.03, maxLevel: 100 },
  { id: 'hourglass', icon: '⏳', perLevel: 1, maxLevel: 30 },
  { id: 'emberCore', icon: '🔥', perLevel: 0.06, maxLevel: 100, element: 'ember' },
  { id: 'tideCore', icon: '💧', perLevel: 0.06, maxLevel: 100, element: 'tide' },
  { id: 'groveCore', icon: '🌿', perLevel: 0.06, maxLevel: 100, element: 'grove' },
];

export const CHARM_BY_ID = Object.fromEntries(CHARMS.map((c) => [c.id, c])) as Record<CharmId, CharmDef>;

/** Base chance that a defeated boss drops a charm (shrinks as the collection grows, see charmDropChance). */
export const BOSS_CHARM_CHANCE = 0.08;
