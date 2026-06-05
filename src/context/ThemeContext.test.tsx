import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEME_STORAGE_KEY } from '../theme/theme';

function ThemeProbe() {
  const { preference, resolved } = useTheme();
  return (
    <div>
      <span data-testid="preference">{preference}</span>
      <span data-testid="resolved">{resolved}</span>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes from stored preference and applies resolved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('preference').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('updates DOM when OS theme changes while preference is system', () => {
    let matches = false;
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event, handler) => {
        changeHandler = handler as (event: MediaQueryListEvent) => void;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved').textContent).toBe('light');

    act(() => {
      matches = true;
      changeHandler?.({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
