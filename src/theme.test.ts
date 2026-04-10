import { describe, expect, it } from 'vitest';
import {
  parseStoredPreference,
  resolveEffectiveTheme,
  THEME_STORAGE_KEY,
} from './theme';

describe('THEME_STORAGE_KEY', () => {
  it('matches lookbook ticket contract', () => {
    expect(THEME_STORAGE_KEY).toBe('lookbook-theme');
  });
});

describe('parseStoredPreference', () => {
  it('returns system for null', () => {
    expect(parseStoredPreference(null)).toBe('system');
  });

  it('accepts light, dark, system', () => {
    expect(parseStoredPreference('light')).toBe('light');
    expect(parseStoredPreference('dark')).toBe('dark');
    expect(parseStoredPreference('system')).toBe('system');
  });

  it('falls back to system for unknown values', () => {
    expect(parseStoredPreference('')).toBe('system');
    expect(parseStoredPreference('nope')).toBe('system');
  });
});

describe('resolveEffectiveTheme', () => {
  it('honors explicit light and dark', () => {
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('light', false)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
    expect(resolveEffectiveTheme('dark', true)).toBe('dark');
  });

  it('uses OS preference for system', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
  });
});
