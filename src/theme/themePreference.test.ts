import { describe, expect, it } from 'vitest';
import {
  parseStoredPreference,
  readStoredPreference,
  resolveEffectiveTheme,
} from './themePreference';

describe('parseStoredPreference', () => {
  it('returns system for null or unknown', () => {
    expect(parseStoredPreference(null)).toBe('system');
    expect(parseStoredPreference('')).toBe('system');
    expect(parseStoredPreference('invalid')).toBe('system');
  });

  it('accepts light, dark, system', () => {
    expect(parseStoredPreference('light')).toBe('light');
    expect(parseStoredPreference('dark')).toBe('dark');
    expect(parseStoredPreference('system')).toBe('system');
  });
});

describe('readStoredPreference', () => {
  it('reads valid keys from storage', () => {
    const storage = {
      getItem: (k: string) => (k === 'lookbook-theme' ? 'dark' : null),
    } as Storage;
    expect(readStoredPreference(storage)).toBe('dark');
  });

  it('falls back to system on errors', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(readStoredPreference(storage)).toBe('system');
  });
});

describe('resolveEffectiveTheme', () => {
  it('uses explicit light/dark', () => {
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
  });

  it('follows system when preference is system', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
  });
});
