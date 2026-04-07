import { describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyEffectiveThemeToDocument,
  getSystemIsDark,
  isThemePreference,
  readStoredPreference,
  resolveEffectiveTheme,
  writeStoredPreference,
} from './theme';

describe('isThemePreference', () => {
  it('accepts system, light, dark', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('foo')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});

describe('readStoredPreference / writeStoredPreference', () => {
  it('defaults to system when missing or invalid', () => {
    const s = { _m: new Map<string, string>() } as unknown as Storage;
    Object.defineProperty(s, 'getItem', {
      value: (k: string) => s._m.get(k) ?? null,
    });
    Object.defineProperty(s, 'setItem', {
      value: (k: string, v: string) => {
        s._m.set(k, v);
      },
    });
    Object.defineProperty(s, 'removeItem', {
      value: (k: string) => {
        s._m.delete(k);
      },
    });

    expect(readStoredPreference(s)).toBe('system');
    s.setItem(THEME_STORAGE_KEY, 'light');
    expect(readStoredPreference(s)).toBe('light');
    s.setItem(THEME_STORAGE_KEY, 'nope');
    expect(readStoredPreference(s)).toBe('system');
  });

  it('removes key when preference is system', () => {
    const s = { _m: new Map<string, string>() } as unknown as Storage;
    Object.defineProperty(s, 'getItem', {
      value: (k: string) => s._m.get(k) ?? null,
    });
    Object.defineProperty(s, 'setItem', {
      value: (k: string, v: string) => {
        s._m.set(k, v);
      },
    });
    Object.defineProperty(s, 'removeItem', {
      value: (k: string) => {
        s._m.delete(k);
      },
    });
    writeStoredPreference(s, 'dark');
    expect(s.getItem(THEME_STORAGE_KEY)).toBe('dark');
    writeStoredPreference(s, 'system');
    expect(s.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});

describe('resolveEffectiveTheme', () => {
  it('maps preference and system', () => {
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('light', false)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
    expect(resolveEffectiveTheme('system', false)).toBe('light');
  });
});

describe('applyEffectiveThemeToDocument', () => {
  it('sets data-theme and color-scheme', () => {
    const doc = {
      documentElement: {
        dataset: {} as DOMStringMap,
        style: { colorScheme: '' as string },
      },
    } as unknown as Document;
    applyEffectiveThemeToDocument(doc, 'dark');
    expect(doc.documentElement.dataset.theme).toBe('dark');
    expect(doc.documentElement.style.colorScheme).toBe('dark');
  });
});

describe('getSystemIsDark', () => {
  it('reads matchMedia when window exists', () => {
    const mql = { matches: true };
    vi.stubGlobal('window', {
      matchMedia: () => mql,
    });
    expect(getSystemIsDark()).toBe(true);
    vi.unstubAllGlobals();
  });
});
