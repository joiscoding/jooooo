import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../components/ThemeToggle';
import { THEME_STORAGE_KEY } from '../theme/preferences';
import { ThemeProvider } from './ThemeContext';

function setupMatchMedia(initialDark: boolean) {
  const state = { dark: initialDark };
  let changeCb: (() => void) | undefined;
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    const isColorScheme = query === '(prefers-color-scheme: dark)';
    return {
      get matches() {
        return isColorScheme ? state.dark : false;
      },
      media: query,
      addEventListener: (type: string, cb: EventListener) => {
        if (isColorScheme && type === 'change') {
          changeCb = cb as () => void;
        }
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;
  });
  return {
    setDark(next: boolean) {
      state.dark = next;
    },
    fireOsThemeChange() {
      changeCb?.();
    },
  };
}

describe('ThemeProvider + ThemeToggle', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.dataset.theme = 'light';
    vi.restoreAllMocks();
  });

  it('initializes from localStorage and applies resolved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    setupMatchMedia(false);
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('persists explicit preference to localStorage', async () => {
    setupMatchMedia(false);
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Light' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('updates resolved theme when OS preference changes in system mode', () => {
    const mq = setupMatchMedia(false);
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(document.documentElement.dataset.theme).toBe('light');
    mq.setDark(true);
    mq.fireOsThemeChange();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
