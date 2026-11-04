import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../components/ThemeToggle';
import { THEME_KEY, getInitialTheme } from './useTheme';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function mockSystemDark(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: dark && query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );
}

describe('getInitialTheme', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('follows the system preference when nothing is saved', () => {
    mockSystemDark(true);
    expect(getInitialTheme()).toBe('dark');
    mockSystemDark(false);
    expect(getInitialTheme()).toBe('light');
  });

  it('prefers the saved choice over the system preference', () => {
    mockSystemDark(true);
    localStorage.setItem(THEME_KEY, 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('ignores an invalid saved value', () => {
    mockSystemDark(true);
    localStorage.setItem(THEME_KEY, 'sepia');
    expect(getInitialTheme()).toBe('dark');
  });
});

describe('ThemeToggle', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it('applies the system theme on first visit without saving it', () => {
    mockSystemDark(true);
    act(() => root.render(<ThemeToggle />));

    const button = container.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
  });

  it('toggles the theme and persists the choice', () => {
    mockSystemDark(false);
    act(() => root.render(<ThemeToggle />));
    const button = container.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBe('Dark theme');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    act(() => button.click());
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');

    act(() => button.click());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });
});
