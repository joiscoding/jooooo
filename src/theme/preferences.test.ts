import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  parseThemePreference,
  resolveTheme,
} from './preferences';

function stubPrefersColorScheme(isDark: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    const matches =
      query === '(prefers-color-scheme: dark)' ? isDark : false;
    return {
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList;
  });
}

describe('parseThemePreference', () => {
  it('defaults invalid or empty values to system', () => {
    expect(parseThemePreference(null)).toBe('system');
    expect(parseThemePreference('')).toBe('system');
    expect(parseThemePreference('auto')).toBe('system');
  });

  it('accepts allowed stored values', () => {
    expect(parseThemePreference('light')).toBe('light');
    expect(parseThemePreference('dark')).toBe('dark');
    expect(parseThemePreference('system')).toBe('system');
  });
});

describe('resolveTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns explicit light and dark', () => {
    stubPrefersColorScheme(true);
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('maps system to OS dark preference', () => {
    stubPrefersColorScheme(true);
    expect(resolveTheme('system')).toBe('dark');
    stubPrefersColorScheme(false);
    expect(resolveTheme('system')).toBe('light');
  });
});

describe('applyResolvedTheme', () => {
  it('sets data-theme on the root element', () => {
    applyResolvedTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    applyResolvedTheme('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});

describe('THEME_STORAGE_KEY', () => {
  it('matches the inline boot script in index.html', () => {
    expect(THEME_STORAGE_KEY).toBe('lookbook-theme');
  });
});
