import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LOOKBOOK_THEME_STORAGE_KEY } from './constants';
import { readStoredThemePreference } from './readStoredThemePreference';

describe('readStoredThemePreference', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns system when storage is empty', () => {
    expect(readStoredThemePreference()).toBe('system');
  });

  it('returns stored valid values', () => {
    localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, 'light');
    expect(readStoredThemePreference()).toBe('light');
    localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, 'dark');
    expect(readStoredThemePreference()).toBe('dark');
    localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, 'system');
    expect(readStoredThemePreference()).toBe('system');
  });

  it('returns system for unknown values', () => {
    localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, 'nope');
    expect(readStoredThemePreference()).toBe('system');
  });
});
