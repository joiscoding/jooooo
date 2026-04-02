import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useThemeContext } from './ThemeContext';

const STORAGE_KEY = 'lookbook-theme';

type Listener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initialDarkMode: boolean) {
  let matches = initialDarkMode;
  const listeners = new Set<Listener>();
  const mediaQuery = {
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_: string, listener: Listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: Listener) => {
      listeners.delete(listener);
    },
    addListener: (listener: Listener) => {
      listeners.add(listener);
    },
    removeListener: (listener: Listener) => {
      listeners.delete(listener);
    },
    dispatchEvent: () => true,
  } as MediaQueryList;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation(() => mediaQuery),
  });

  return {
    setDarkMode(nextDarkMode: boolean) {
      matches = nextDarkMode;
      const event = { matches } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function ThemeProbe() {
  const { preference, resolvedTheme, setPreference } = useThemeContext();

  return (
    <>
      <p data-testid="preference">{preference}</p>
      <p data-testid="resolved-theme">{resolvedTheme}</p>
      <button type="button" onClick={() => setPreference('system')}>
        set-system
      </button>
      <button type="button" onClick={() => setPreference('light')}>
        set-light
      </button>
      <button type="button" onClick={() => setPreference('dark')}>
        set-dark
      </button>
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('defaults to system preference and uses dark when system is dark', async () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect((await screen.findByTestId('preference')).textContent).toBe('system');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('system');
  });

  it('uses saved theme preference from localStorage', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'light');
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect((await screen.findByTestId('preference')).textContent).toBe('light');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('reacts to system preference changes while in system mode', async () => {
    const media = mockMatchMedia(false);

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect((await screen.findByTestId('resolved-theme')).textContent).toBe(
      'light'
    );

    media.setDarkMode(true);

    await waitFor(() => {
      expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    });

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists explicit user preference changes', async () => {
    mockMatchMedia(false);

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await screen.findByTestId('resolved-theme');
    fireEvent.click(screen.getByRole('button', { name: 'set-dark' }));

    await waitFor(() => {
      expect(screen.getByTestId('preference').textContent).toBe('dark');
    });

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });
});
