import { describe, expect, it } from 'vitest';
import {
  parseStoredPreference,
  readStoredPreference,
  resolveColorScheme,
  writeStoredPreference,
} from './theme';

describe('parseStoredPreference', () => {
  it('returns system for null or unknown', () => {
    expect(parseStoredPreference(null)).toBe('system');
    expect(parseStoredPreference('')).toBe('system');
    expect(parseStoredPreference('foo')).toBe('system');
  });

  it('accepts light, dark, system', () => {
    expect(parseStoredPreference('light')).toBe('light');
    expect(parseStoredPreference('dark')).toBe('dark');
    expect(parseStoredPreference('system')).toBe('system');
  });
});

describe('resolveColorScheme', () => {
  it('respects explicit light and dark', () => {
    expect(resolveColorScheme('light', true)).toBe('light');
    expect(resolveColorScheme('light', false)).toBe('light');
    expect(resolveColorScheme('dark', false)).toBe('dark');
    expect(resolveColorScheme('dark', true)).toBe('dark');
  });

  it('uses prefersDark for system', () => {
    expect(resolveColorScheme('system', true)).toBe('dark');
    expect(resolveColorScheme('system', false)).toBe('light');
  });
});

describe('readStoredPreference / writeStoredPreference', () => {
  it('reads and writes via Storage', () => {
    const storage = {
      _m: new Map<string, string>(),
      getItem(k: string) {
        return this._m.get(k) ?? null;
      },
      setItem(k: string, v: string) {
        this._m.set(k, v);
      },
    } as unknown as Storage;

    expect(readStoredPreference(storage)).toBe('system');
    writeStoredPreference(storage, 'dark');
    expect(readStoredPreference(storage)).toBe('dark');
  });
});
