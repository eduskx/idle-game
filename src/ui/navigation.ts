/** The five bottom-nav destinations. */
export const NAV_TABS = ['home', 'team', 'summon', 'upgrades', 'more'] as const;
export type NavTab = (typeof NAV_TABS)[number];

/** Screens reached from a nav tab (battle and rebloom via the hub, expeditions via team). */
export type Route = NavTab | 'battle' | 'rebloom' | 'expeditions';

/** The nav tab that stays highlighted while a route is open. */
export const ROUTE_PARENT: Record<Route, NavTab> = {
  home: 'home',
  battle: 'home',
  rebloom: 'home',
  team: 'team',
  expeditions: 'team',
  summon: 'summon',
  upgrades: 'upgrades',
  more: 'more',
};

export const TAB_KEY = 'hollowbloom.tab';

/**
 * Turns whatever is stored under TAB_KEY into the tab to open on launch. Older versions
 * stored 'battle' and 'rebloom' as tabs; those (and any garbage) land on a valid nav tab,
 * so the hub is the start screen unless the player was on another top-level tab.
 */
export function parseStoredTab(value: string | null | undefined): NavTab {
  if (value && Object.hasOwn(ROUTE_PARENT, value)) return ROUTE_PARENT[value as Route];
  return 'home';
}
