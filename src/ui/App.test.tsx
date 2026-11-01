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
  it('renders the battle screen and navigation', () => {
    render(<App />);
    expect(screen.getByText('Hollowbloom')).toBeTruthy();
    expect(screen.getByText('Buttercup Meadow')).toBeTruthy();
    expect(
      screen.getAllByRole('button', { name: /Team|Summon|Upgrades|Rebloom|More/ }).length,
    ).toBeGreaterThan(4);
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
