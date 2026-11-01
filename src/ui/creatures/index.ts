import { Bonecrow } from './bonecrow';
import { Drownedknight } from './drownedknight';
import { Eclipsewyrm } from './eclipsewyrm';
import { Emberpup } from './emberpup';
import { Gloomwisp } from './gloomwisp';
import { Hexcat } from './hexcat';
import { Honeybear } from './honeybear';
import type { CreatureArt } from './kit';
import { Mossling } from './mossling';
import { Puddlefin } from './puddlefin';
import { Teacup } from './teacup';

/** Hand-drawn art per creature id (Hearth first, then Umbra). */
export const CREATURE_ART: Record<string, CreatureArt> = {
  mossling: Mossling,
  emberpup: Emberpup,
  puddlefin: Puddlefin,
  teacup: Teacup,
  honeybear: Honeybear,
  gloomwisp: Gloomwisp,
  bonecrow: Bonecrow,
  hexcat: Hexcat,
  drownedknight: Drownedknight,
  eclipsewyrm: Eclipsewyrm,
};

export type { View, ArtProps } from './kit';
