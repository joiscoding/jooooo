import { describe, expect, it, vi } from 'vitest';
import {
  LOOKBOOK_THEME_STORAGE_KEY,
  isThemePreference,
  readStoredPreference,
  resolveEffectiveTheme,
  writeStoredPreference,
} from './theme';

function mockStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: vi.fn((k: string) => (map.has(k) ? map.get(k)! : null)),
    setItem: vi.fn((k: string, v: string) => {
      map.set(k, v);
    }),
    removeItem: vi.fn((k: string) => {
      map.delete(k);
    }),
    clear: vi.fn(() => map.clear()),
  } as unknown as Storage;
}

describe('theme preference helpers', () => {
  it('isThemePreference accepts only system, light, dark', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('foo')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it('readStoredPreference returns null for missing or invalid', () => {
    const s = mockStorage({});
    expect(readStoredPreference(s)).toBe(null);
    const s2 = mockStorage({ [LOOKBOOK_THEME_STORAGE_KEY]: 'nope' });
    expect(readStoredPreference(s2)).toBe(null);
  });

  it('readStoredPreference returns valid stored value', () => {
    const s = mockStorage({ [LOOKBOOK_THEME_STORAGE_KEY]: 'dark' });
    expect(readStoredPreference(s)).toBe('dark');
  });

  it('writeStoredPreference persists', () => {
    const s = mockStorage();
    writeStoredPreference(s, 'light');
    expect(s.setItem).toHaveBeenCalledWith(LOOKBOOK_THEME_STORAGE_KEY, 'light');
  });

  it('resolveEffectiveTheme maps system to OS preference', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
  });
});
