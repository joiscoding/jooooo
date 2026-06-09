import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEME_STORAGE_KEY } from '../theme';

function Probe() {
  const { preference, effectiveTheme } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <span data-testid="effective">{effectiveTheme}</span>
    </div>
  );
}

type Listener = () => void;

function createMatchMediaController(initialDark: boolean) {
  let dark = initialDark;
  const listeners = new Set<Listener>();

  const matchMedia = vi.fn((query: string) => {
    if (query !== '(prefers-color-scheme: dark)') {
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    }
    return {
      get matches() {
        return dark;
      },
      media: query,
      addEventListener: (_: string, cb: Listener) => {
        listeners.add(cb);
      },
      removeEventListener: (_: string, cb: Listener) => {
        listeners.delete(cb);
      },
    };
  });

  return {
    matchMedia,
    setDark(next: boolean) {
      dark = next;
      listeners.forEach((cb) => cb());
    },
  };
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('defaults to system and applies resolved theme to the document', async () => {
    const { matchMedia, setDark } = createMatchMediaController(true);
    vi.stubGlobal('matchMedia', matchMedia);

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('pref').textContent).toBe('system');
    expect(screen.getByTestId('effective').textContent).toBe('dark');
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    setDark(false);
    await waitFor(() => {
      expect(screen.getByTestId('effective').textContent).toBe('light');
      expect(document.documentElement.dataset.theme).toBe('light');
    });
  });

  it('persists explicit preference to localStorage', async () => {
    vi.stubGlobal(
      'matchMedia',
      createMatchMediaController(false).matchMedia,
    );

    function SwitchToDark() {
      const { setPreference } = useTheme();
      return (
        <button type="button" onClick={() => setPreference('dark')}>
          go dark
        </button>
      );
    }

    render(
      <ThemeProvider>
        <Probe />
        <SwitchToDark />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'go dark' }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  it('reads initial preference from localStorage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    vi.stubGlobal(
      'matchMedia',
      createMatchMediaController(true).matchMedia,
    );

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('pref').textContent).toBe('light');
    expect(screen.getByTestId('effective').textContent).toBe('light');
  });
});
