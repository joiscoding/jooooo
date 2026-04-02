import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useThemeContext } from './ThemeContext';

type MatchMediaListener = (event: MediaQueryListEvent) => void;

type MatchMediaMock = {
  setMatches: (nextMatches: boolean) => void;
};

function installMatchMediaMock(initialMatches: boolean): MatchMediaMock {
  let matches = initialMatches;
  const listeners = new Set<MatchMediaListener>();

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () => {
      return {
        matches,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: (
          event: string,
          listener: MatchMediaListener
        ) => {
          if (event === 'change') {
            listeners.add(listener);
          }
        },
        removeEventListener: (
          event: string,
          listener: MatchMediaListener
        ) => {
          if (event === 'change') {
            listeners.delete(listener);
          }
        },
        dispatchEvent: () => true,
      };
    },
  });

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches: nextMatches } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function ThemeHarness() {
  const { preference, resolvedTheme, setPreference } = useThemeContext();
  return (
    <div>
      <p data-testid="preference">{preference}</p>
      <p data-testid="resolved">{resolvedTheme}</p>
      <button type="button" onClick={() => setPreference('light')}>
        Set light
      </button>
      <button type="button" onClick={() => setPreference('dark')}>
        Set dark
      </button>
      <button type="button" onClick={() => setPreference('system')}>
        Set system
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to system and resolves from OS preference', () => {
    installMatchMediaMock(true);

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem('lookbook-theme')).toBe('system');
  });

  it('initializes from localStorage preference and persists updates', async () => {
    installMatchMediaMock(true);
    window.localStorage.setItem('lookbook-theme', 'light');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await user.click(screen.getByRole('button', { name: 'Set dark' }));

    expect(screen.getByTestId('preference')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem('lookbook-theme')).toBe('dark');
  });

  it('updates resolved theme when system preference changes in system mode', async () => {
    const media = installMatchMediaMock(false);
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    media.setMatches(true);
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    await user.click(screen.getByRole('button', { name: 'Set light' }));
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    media.setMatches(true);
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
