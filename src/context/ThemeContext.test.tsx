import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';
import { LOOKBOOK_THEME_STORAGE_KEY } from '../theme/theme';

function Probe() {
  const { preference, effectiveTheme } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <span data-testid="effective">{effectiveTheme}</span>
    </div>
  );
}

function Controls() {
  const { setPreference } = useTheme();
  return (
    <div>
      <button type="button" onClick={() => setPreference('dark')}>
        force-dark
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  const matchMediaListeners = new Map<string, (e: MediaQueryListEvent) => void>();

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => {
        const mql = {
          matches: false,
          media: query,
          addEventListener: vi.fn(
            (_: 'change', cb: (e: MediaQueryListEvent) => void) => {
              matchMediaListeners.set(query, cb);
            }
          ),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
        return mql;
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    matchMediaListeners.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to system and applies light when OS prefers light', () => {
    window.matchMedia = vi.fn(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('pref').textContent).toBe('system');
    expect(screen.getByTestId('effective').textContent).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('persists preference to localStorage when changed', async () => {
    const user = userEvent.setup();
    window.matchMedia = vi.fn(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <Controls />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'force-dark' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOOKBOOK_THEME_STORAGE_KEY,
      'dark'
    );
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('updates effective theme when system preference changes', async () => {
    let darkMatches = false;
    window.matchMedia = vi.fn((q: string) => {
      const isDarkQuery = q === '(prefers-color-scheme: dark)';
      const mql = {
        get matches() {
          return isDarkQuery ? darkMatches : false;
        },
        media: q,
        addEventListener: vi.fn((type: string, cb: (e: MediaQueryListEvent) => void) => {
          if (type === 'change' && isDarkQuery) {
            matchMediaListeners.set('dark', cb);
          }
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
      return mql;
    }) as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('effective').textContent).toBe('light');

    darkMatches = true;
    const cb = matchMediaListeners.get('dark');
    expect(cb).toBeDefined();
    await act(async () => {
      cb!({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('effective').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
