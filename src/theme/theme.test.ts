import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getStoredPreference,
  getSystemTheme,
  resolveTheme,
  setStoredPreference,
} from './theme';

describe('theme storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to system when nothing is stored', () => {
    expect(getStoredPreference()).toBe('system');
  });

  it('reads and writes preference to localStorage', () => {
    setStoredPreference('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(getStoredPreference()).toBe('dark');
  });

  it('falls back to system for invalid stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
    expect(getStoredPreference()).toBe('system');
  });
});

describe('resolveTheme', () => {
  it('returns explicit light and dark preferences', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('follows system preference when set to system', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(getSystemTheme()).toBe('dark');
    expect(resolveTheme('system')).toBe('dark');
  });
});

describe('applyTheme', () => {
  it('sets data-theme and color-scheme on the document root', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    applyTheme('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
