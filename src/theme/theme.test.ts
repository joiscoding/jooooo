import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  applyThemePreference,
  getStoredOrDefaultPreference,
  getToggledPreference,
  getSystemTheme,
  isThemePreference,
  readStoredPreference,
  resolveTheme,
  writeStoredPreference,
} from './theme';

describe('theme preference', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to system when storage is empty', () => {
    expect(getStoredOrDefaultPreference()).toBe('system');
    expect(readStoredPreference()).toBeNull();
  });

  it('validates stored preference values', () => {
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('sepia')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it('persists preference in localStorage', () => {
    writeStoredPreference('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(readStoredPreference()).toBe('dark');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    expect(readStoredPreference()).toBeNull();
    expect(getStoredOrDefaultPreference()).toBe('system');
  });
});

describe('resolveTheme', () => {
  it('uses explicit light and dark', () => {
    expect(resolveTheme('light', 'dark')).toBe('light');
    expect(resolveTheme('dark', 'light')).toBe('dark');
  });

  it('follows system theme when preference is system', () => {
    expect(resolveTheme('system', 'light')).toBe('light');
    expect(resolveTheme('system', 'dark')).toBe('dark');
  });
});

describe('getToggledPreference', () => {
  it('flips between light and dark', () => {
    expect(getToggledPreference('light')).toBe('dark');
    expect(getToggledPreference('dark')).toBe('light');
  });
});

describe('getSystemTheme', () => {
  it('reads prefers-color-scheme media', () => {
    expect(getSystemTheme({ matches: true })).toBe('dark');
    expect(getSystemTheme({ matches: false })).toBe('light');
  });
});

describe('applyThemePreference', () => {
  it('sets data-theme on the document element', () => {
    applyThemePreference('dark', 'dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    applyThemePreference('light', 'dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('applies resolved theme from system override', () => {
    applyResolvedTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('storage errors', () => {
  it('returns null when localStorage throws', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readStoredPreference()).toBeNull();
    getItem.mockRestore();
  });
});
