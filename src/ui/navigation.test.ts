import { describe, expect, it } from 'vitest';
import { NAV_TABS, parseStoredTab } from './navigation';

describe('parseStoredTab', () => {
  it('keeps current nav tabs', () => {
    for (const tab of NAV_TABS) expect(parseStoredTab(tab)).toBe(tab);
  });

  it('maps legacy and sub-route ids to their parent tab', () => {
    expect(parseStoredTab('battle')).toBe('home');
    expect(parseStoredTab('rebloom')).toBe('home');
    expect(parseStoredTab('expeditions')).toBe('team');
  });

  it('falls back to home for missing or unknown values', () => {
    expect(parseStoredTab(null)).toBe('home');
    expect(parseStoredTab(undefined)).toBe('home');
    expect(parseStoredTab('')).toBe('home');
    expect(parseStoredTab('toString')).toBe('home');
    expect(parseStoredTab('"battle"')).toBe('home');
  });
});
