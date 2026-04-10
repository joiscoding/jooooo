import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEME_STORAGE_KEY } from '../theme';

function Probe() {
  const { preference, resolvedTheme } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('dark') ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('defaults to system and applies resolved theme to document', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('pref').textContent).toBe('system');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('reads stored preference from localStorage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('pref').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists preference when updated via context', async () => {
    function Switcher() {
      const { setPreference } = useTheme();
      return (
        <button type="button" onClick={() => setPreference('dark')}>
          go dark
        </button>
      );
    }
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Switcher />
        <Probe />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: /go dark/i }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('reacts to system preference changes when mode is system', () => {
    let dark = false;
    const listeners = new Map<string, Set<EventListener>>();
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => {
        const mql = {
          get matches() {
            return dark && query.includes('prefers-color-scheme');
          },
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: (
            _type: string,
            cb: EventListener,
          ) => {
            if (!listeners.has(query)) listeners.set(query, new Set());
            listeners.get(query)!.add(cb);
          },
          removeEventListener: (
            _type: string,
            cb: EventListener,
          ) => {
            listeners.get(query)?.delete(cb);
          },
          dispatchEvent: vi.fn(),
        };
        return mql;
      }),
    );

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('resolved').textContent).toBe('light');

    act(() => {
      dark = true;
      const cbs = listeners.get('(prefers-color-scheme: dark)');
      cbs?.forEach((cb) => cb(new Event('change')));
    });
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
