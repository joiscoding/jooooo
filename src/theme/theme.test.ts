import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  LOOKBOOK_THEME_STORAGE_KEY,
  parseStoredPreference,
  resolveEffectiveTheme,
  readStoredPreference,
  applyThemeToDocument,
} from './theme';

describe('parseStoredPreference', () => {
  it('defaults to system for null or empty', () => {
    expect(parseStoredPreference(null)).toBe('system');
    expect(parseStoredPreference('')).toBe('system');
  });

  it('parses JSON-stringified values', () => {
    expect(parseStoredPreference('"dark"')).toBe('dark');
    expect(parseStoredPreference('"light"')).toBe('light');
    expect(parseStoredPreference('"system"')).toBe('system');
  });

  it('accepts plain tokens for backwards compatibility', () => {
    expect(parseStoredPreference('dark')).toBe('dark');
  });

  it('falls back to system for invalid JSON', () => {
    expect(parseStoredPreference('not-json')).toBe('system');
  });
});

describe('resolveEffectiveTheme', () => {
  it('honors explicit light and dark', () => {
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('light', false)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
    expect(resolveEffectiveTheme('dark', true)).toBe('dark');
  });

  it('uses system preference for system', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
  });
});

describe('readStoredPreference', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads from lookbook-theme key', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('"light"');
    expect(readStoredPreference()).toBe('light');
    expect(localStorage.getItem).toHaveBeenCalledWith(LOOKBOOK_THEME_STORAGE_KEY);
  });
});

describe('applyThemeToDocument', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });

  it('sets data-theme and color-scheme', () => {
    applyThemeToDocument('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    applyThemeToDocument('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
