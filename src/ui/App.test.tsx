// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { MemoryRepository } from '../persistence/repository';
import { gameStore } from '../store/gameStore';
import { App } from './App';

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], updateServiceWorker: async () => {} }),
}));

beforeAll(async () => {
  // jsdom has no <dialog> support.
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
  await gameStore.init(new MemoryRepository());
  gameStore.dispatch((s) => (s.settings.language = 'en'));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('App', () => {
  it('opens on the home hub with five nav tabs', () => {
    render(<App />);
    expect(screen.getByText('Hollowbloom')).toBeTruthy();
    expect(screen.getByText('Buttercup Meadow')).toBeTruthy();
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getAllByRole('button').map((b) => b.textContent?.replace(/\W/g, ''))).toEqual([
      'Home',
      'Team',
      'Summon',
      'Upgrades',
      'More',
    ]);
    // Locked features stay visible with their condition.
    expect(screen.getByText('Rebloom')).toBeTruthy();
    expect(screen.getAllByText(/Unlocks at stage/).length).toBe(2);
  });

  it('opens the battle from the hub and returns home', async () => {
    render(<App />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Keep fighting/ }));
    });
    expect(await screen.findByText(/Auto-advance/)).toBeTruthy();
    expect(localStorage.getItem('hollowbloom.tab')).toBe('home');
    await act(async () => {
      fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Home' }));
    });
    expect(screen.getByRole('button', { name: /Keep fighting/ })).toBeTruthy();
  });

  it.each(['battle', 'rebloom', 'nonsense'])('falls back to the hub for stored tab %s', (stored) => {
    localStorage.setItem('hollowbloom.tab', stored);
    render(<App />);
    expect(screen.getByRole('button', { name: /Keep fighting/ })).toBeTruthy();
  });

  it('navigates to the team screen', async () => {
    render(<App />);
    await act(async () => {
      fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Team' }));
    });
    expect(await screen.findByText('Mossling')).toBeTruthy();
  });

  it('switches language', async () => {
    render(<App />);
    act(() => {
      gameStore.dispatch((s) => (s.settings.language = 'de'));
    });
    expect(screen.getByText('Butterblumenwiese')).toBeTruthy();
    act(() => {
      gameStore.dispatch((s) => (s.settings.language = 'en'));
    });
  });
});
