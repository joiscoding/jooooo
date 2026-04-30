import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { isSearchFocusShortcut } from './isSearchFocusShortcut';

function key(
  init: Partial<KeyboardEventInit> & { key: string },
): Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'repeat'> {
  return {
    key: init.key,
    metaKey: init.metaKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    altKey: init.altKey ?? false,
    repeat: init.repeat ?? false,
  };
}

describe('isSearchFocusShortcut', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  it('returns false for repeat events', () => {
    expect(isSearchFocusShortcut(key({ key: 'k', metaKey: true, repeat: true }))).toBe(
      false,
    );
  });

  it('returns false when key is not k', () => {
    expect(isSearchFocusShortcut(key({ key: 'j', metaKey: true }))).toBe(false);
  });

  it('returns false when Alt is held', () => {
    expect(
      isSearchFocusShortcut(key({ key: 'k', metaKey: true, altKey: true })),
    ).toBe(false);
  });

  describe('on Apple platforms', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          ...originalNavigator,
          platform: 'MacIntel',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        configurable: true,
      });
    });

    it('returns true for Meta+K', () => {
      expect(isSearchFocusShortcut(key({ key: 'k', metaKey: true }))).toBe(true);
      expect(isSearchFocusShortcut(key({ key: 'K', metaKey: true }))).toBe(true);
    });

    it('returns false for Ctrl+K to avoid fighting browser link hints', () => {
      expect(isSearchFocusShortcut(key({ key: 'k', ctrlKey: true }))).toBe(false);
    });
  });

  describe('on non-Apple platforms', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          ...originalNavigator,
          platform: 'Win32',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        configurable: true,
      });
    });

    it('returns true for Ctrl+K', () => {
      expect(isSearchFocusShortcut(key({ key: 'k', ctrlKey: true }))).toBe(true);
    });

    it('returns false for Meta+K', () => {
      expect(isSearchFocusShortcut(key({ key: 'k', metaKey: true }))).toBe(false);
    });
  });
});
