import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ThemeProvider,
  useThemeContext,
  initializeThemeClass,
  THEME_STORAGE_KEY,
} from './ThemeContext';

type MatchMediaStub = {
  matches: boolean;
  listeners: Array<() => void>;
  addListener: (listener: () => void) => void;
  removeListener: (listener: () => void) => void;
  addEventListener: (event: string, listener: () => void) => void;
  removeEventListener: (event: string, listener: () => void) => void;
};

let mediaStub: MatchMediaStub;
let originalMatchMedia: ((query: string) => MediaQueryList) | undefined;

function mockMatchMedia(initialDark: boolean) {
  mediaStub = {
    matches: initialDark,
    listeners: [],
    addListener(listener) {
      this.listeners.push(listener);
    },
    removeListener(listener) {
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    },
    addEventListener(event, listener) {
      if (event === 'change') this.listeners.push(listener);
    },
    removeEventListener(event, listener) {
      if (event !== 'change') return;
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    },
  };

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation(
      () => mediaStub as unknown as MediaQueryList
    ),
  });
}

function emitSystemChange(isDark: boolean) {
  mediaStub.matches = isDark;
  for (const listener of [...mediaStub.listeners]) {
    listener();
  }
}

function ThemeHarness() {
  const { preference, setPreference } = useThemeContext();
  return (
    <div>
      <p data-testid="preference">{preference}</p>
      <button type="button" onClick={() => setPreference('light')}>
        Light
      </button>
      <button type="button" onClick={() => setPreference('dark')}>
        Dark
      </button>
      <button type="button" onClick={() => setPreference('system')}>
        System
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    localStorage.clear();
    document.documentElement.className = '';
    mockMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('uses stored preference at startup', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('theme-dark');
  });

  it('persists explicit preference changes', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement).toHaveClass('theme-dark');

    await user.click(screen.getByRole('button', { name: 'Light' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement).not.toHaveClass('theme-dark');
  });

  it('follows system preference while in system mode', async () => {
    const user = userEvent.setup();
    localStorage.setItem(THEME_STORAGE_KEY, 'system');

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('system');
    expect(document.documentElement).not.toHaveClass('theme-dark');

    emitSystemChange(true);
    expect(document.documentElement).toHaveClass('theme-dark');

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    emitSystemChange(false);
    expect(document.documentElement).toHaveClass('theme-dark');

    await user.click(screen.getByRole('button', { name: 'System' }));
    expect(document.documentElement).not.toHaveClass('theme-dark');
  });

  it('initializes root class before app render', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'system');
    emitSystemChange(true);

    initializeThemeClass();

    expect(document.documentElement).toHaveClass('theme-dark');
  });
});
