import { describe, expect, it } from 'vitest';
import {
  parseStoredPreference,
  resolveEffectiveTheme,
  THEME_STORAGE_KEY,
} from './theme';

describe('parseStoredPreference', () => {
  it('returns system for null or unknown', () => {
    expect(parseStoredPreference(null)).toBe('system');
    expect(parseStoredPreference('')).toBe('system');
    expect(parseStoredPreference('auto')).toBe('system');
  });

  it('accepts valid stored values', () => {
    expect(parseStoredPreference('light')).toBe('light');
    expect(parseStoredPreference('dark')).toBe('dark');
    expect(parseStoredPreference('system')).toBe('system');
  });
});

describe('resolveEffectiveTheme', () => {
  it('honors explicit light and dark', () => {
    expect(resolveEffectiveTheme('light', false)).toBe('light');
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
    expect(resolveEffectiveTheme('dark', true)).toBe('dark');
  });

  it('uses system preference when set to system', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
  });
});

describe('THEME_STORAGE_KEY', () => {
  it('matches lookbook localStorage contract', () => {
    expect(THEME_STORAGE_KEY).toBe('lookbook-theme');
  });
});
