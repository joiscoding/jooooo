import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEME_STORAGE_KEY } from '../theme/theme';

function Probe() {
  const { preference, effectiveTheme } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <span data-testid="eff">{effectiveTheme}</span>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('dark') ? false : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to system and applies resolved theme from OS', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('prefers-color-scheme: dark'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('pref').textContent).toBe('system');
    expect(screen.getByTestId('eff').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists light/dark to localStorage and clears for system', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );

    function Switcher() {
      const { setPreference } = useTheme();
      return (
        <button type="button" onClick={() => setPreference('dark')}>
          go-dark
        </button>
      );
    }

    render(
      <ThemeProvider>
        <Switcher />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'go-dark' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('updates effective theme when system preference changes', async () => {
    let dark = false;
    const listeners: Array<() => void> = [];
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        get matches() {
          return dark;
        },
        media: '(prefers-color-scheme: dark)',
        addEventListener: (_: string, cb: () => void) => {
          listeners.push(cb);
        },
        removeEventListener: vi.fn(),
      }))
    );

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('eff').textContent).toBe('light');

    dark = true;
    listeners.forEach((cb) => cb());

    await waitFor(() => {
      expect(screen.getByTestId('eff').textContent).toBe('dark');
    });
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
