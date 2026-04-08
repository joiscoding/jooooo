import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyDocumentTheme,
  parseThemePreference,
  readStoredTheme,
  resolveEffectiveTheme,
  writeStoredTheme,
  type ThemePreference,
} from './theme';

describe('parseThemePreference', () => {
  it('returns system for null or unknown', () => {
    expect(parseThemePreference(null)).toBe('system');
    expect(parseThemePreference('')).toBe('system');
    expect(parseThemePreference('banana')).toBe('system');
  });

  it('returns light, dark, system when valid', () => {
    expect(parseThemePreference('light')).toBe('light');
    expect(parseThemePreference('dark')).toBe('dark');
    expect(parseThemePreference('system')).toBe('system');
  });
});

describe('readStoredTheme / writeStoredTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to system when unset', () => {
    expect(readStoredTheme()).toBe('system');
  });

  it('persists preference', () => {
    writeStoredTheme('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(readStoredTheme()).toBe('dark');
  });
});

describe('resolveEffectiveTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns light or dark when fixed', () => {
    expect(resolveEffectiveTheme('light')).toBe('light');
    expect(resolveEffectiveTheme('dark')).toBe('dark');
  });

  it('follows prefers-color-scheme when system', () => {
    const mql = { matches: true } as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(mql);
    expect(resolveEffectiveTheme('system')).toBe('dark');

    mql.matches = false;
    expect(resolveEffectiveTheme('system')).toBe('light');
  });
});

describe('applyDocumentTheme', () => {
  it('sets data-theme on documentElement', () => {
    applyDocumentTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    applyDocumentTheme('system' as ThemePreference);
    expect(document.documentElement.dataset.theme).toBe('system');
  });
});
