import { describe, expect, it } from 'vitest';
import {
  parseStoredThemePreference,
  resolveEffectiveColorScheme,
} from './themePreference';

describe('parseStoredThemePreference', () => {
  it('returns system for null, empty, or unknown values', () => {
    expect(parseStoredThemePreference(null)).toBe('system');
    expect(parseStoredThemePreference('')).toBe('system');
    expect(parseStoredThemePreference('auto')).toBe('system');
  });

  it('accepts light, dark, and system', () => {
    expect(parseStoredThemePreference('light')).toBe('light');
    expect(parseStoredThemePreference('dark')).toBe('dark');
    expect(parseStoredThemePreference('system')).toBe('system');
  });
});

describe('resolveEffectiveColorScheme', () => {
  it('honors explicit light and dark preferences regardless of system', () => {
    expect(resolveEffectiveColorScheme('light', true)).toBe('light');
    expect(resolveEffectiveColorScheme('light', false)).toBe('light');
    expect(resolveEffectiveColorScheme('dark', true)).toBe('dark');
    expect(resolveEffectiveColorScheme('dark', false)).toBe('dark');
  });

  it('follows system preference when set to system', () => {
    expect(resolveEffectiveColorScheme('system', true)).toBe('dark');
    expect(resolveEffectiveColorScheme('system', false)).toBe('light');
  });
});
