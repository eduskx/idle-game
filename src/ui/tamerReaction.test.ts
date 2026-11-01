import { describe, expect, it } from 'vitest';
import { BOSS_EVERY } from '../engine/types';
import type { CombatEvent } from '../engine';
import { tamerReaction } from './tamerReaction';

const hit: CombatEvent = { t: 'hit', target: 'enemy', amount: 5, crit: false, eff: 1, id: 1 };
const kill: CombatEvent = { t: 'kill', gold: 1, xp: 1, essence: 0, id: 2 };

describe('tamer reactions', () => {
  it('stays still for routine hits and kills', () => {
    expect(tamerReaction([])).toBeNull();
    expect(tamerReaction([hit, kill])).toBeNull();
  });

  it('cheers a cleared stage and celebrates a beaten boss harder', () => {
    expect(tamerReaction([kill, { t: 'stageClear', stage: BOSS_EVERY + 1, id: 3 }])).toBe('cheer');
    expect(tamerReaction([kill, { t: 'stageClear', stage: BOSS_EVERY, id: 3 }])).toBe('triumph');
  });

  it('flinches at a defeat or a failed boss, even if a stage was cleared in the same tick', () => {
    expect(tamerReaction([{ t: 'defeat', id: 4 }])).toBe('flinch');
    expect(tamerReaction([{ t: 'bossFail', id: 4 }])).toBe('flinch');
    expect(
      tamerReaction([
        { t: 'stageClear', stage: BOSS_EVERY, id: 3 },
        { t: 'defeat', id: 4 },
      ]),
    ).toBe('flinch');
  });
});
