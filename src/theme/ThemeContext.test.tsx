import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../components/ThemeToggle';
import { LOOKBOOK_THEME_STORAGE_KEY } from './constants';
import { ThemeProvider } from './ThemeContext';

function mockMatchMedia(initialDark: boolean) {
  let dark = initialDark;
  const listeners = new Set<(e: { matches: boolean }) => void>();
  const mql = {
    get matches() {
      return dark;
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_type: string, fn: EventListener) => {
      listeners.add(fn as (e: { matches: boolean }) => void);
    },
    removeEventListener: (_type: string, fn: EventListener) => {
      listeners.delete(fn as (e: { matches: boolean }) => void);
    },
    dispatchEvent: vi.fn(),
  };
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    if (query === '(prefers-color-scheme: dark)') {
      return mql as unknown as MediaQueryList;
    }
    return {
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;
  });
  return {
    setSystemDark(next: boolean) {
      dark = next;
      listeners.forEach((fn) => fn({ matches: next }));
    },
  };
}

describe('ThemeProvider + ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-scheme');
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('defaults to system and applies resolved scheme to the document', () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-scheme')).toBe('dark');
    expect(screen.getByRole('button', { name: /auto/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('persists explicit light and updates data-scheme', () => {
    mockMatchMedia(true);
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /^light$/i }));
    expect(localStorage.getItem(LOOKBOOK_THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.getAttribute('data-scheme')).toBe('light');
    expect(screen.getByRole('button', { name: /^light$/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('updates scheme when OS preference changes in system mode', async () => {
    const { setSystemDark } = mockMatchMedia(false);
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(document.documentElement.getAttribute('data-scheme')).toBe('light');
    await act(async () => {
      setSystemDark(true);
    });
    expect(document.documentElement.getAttribute('data-scheme')).toBe('dark');
  });
});
