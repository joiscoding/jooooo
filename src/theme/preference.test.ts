import { describe, expect, it } from 'vitest';
import { parseStoredPreference, resolveEffectiveTheme } from './preference';

describe('parseStoredPreference', () => {
  it('returns system for null or unknown values', () => {
    expect(parseStoredPreference(null)).toBe('system');
    expect(parseStoredPreference('')).toBe('system');
    expect(parseStoredPreference('auto')).toBe('system');
  });

  it('accepts stored tokens', () => {
    expect(parseStoredPreference('system')).toBe('system');
    expect(parseStoredPreference('light')).toBe('light');
    expect(parseStoredPreference('dark')).toBe('dark');
  });
});

describe('resolveEffectiveTheme', () => {
  it('honors explicit light and dark preferences', () => {
    expect(resolveEffectiveTheme('light', false)).toBe('light');
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
    expect(resolveEffectiveTheme('dark', true)).toBe('dark');
  });

  it('maps system preference to OS color scheme', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
  });
});
