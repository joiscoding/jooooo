import { describe, expect, it, vi, afterEach } from 'vitest';
import { getSearchShortcutLabel, isFocusSearchHotkey } from './searchHotkey';

function key(
  overrides: Partial<{
    key: string;
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    repeat: boolean;
  }> = {}
) {
  return {
    key: 'k',
    metaKey: false,
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    repeat: false,
    ...overrides,
  };
}

describe('isFocusSearchHotkey', () => {
  it('matches Ctrl+K', () => {
    expect(isFocusSearchHotkey(key({ ctrlKey: true, key: 'k' }))).toBe(true);
  });

  it('matches ⌘+K', () => {
    expect(isFocusSearchHotkey(key({ ctrlKey: false, metaKey: true, key: 'K' }))).toBe(
      true
    );
  });

  it('rejects repeat', () => {
    expect(isFocusSearchHotkey(key({ repeat: true }))).toBe(false);
  });

  it('rejects wrong key', () => {
    expect(isFocusSearchHotkey(key({ key: 'j' }))).toBe(false);
  });

  it('rejects without modifier', () => {
    expect(
      isFocusSearchHotkey(
        key({ ctrlKey: false, metaKey: false, key: 'k' })
      )
    ).toBe(false);
  });

  it('rejects with Alt', () => {
    expect(isFocusSearchHotkey(key({ altKey: true }))).toBe(false);
  });

  it('rejects with Shift', () => {
    expect(isFocusSearchHotkey(key({ shiftKey: true }))).toBe(false);
  });
});

describe('getSearchShortcutLabel', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns Ctrl+K for non-Mac', () => {
    vi.stubGlobal('navigator', { platform: 'Win32' });
    expect(getSearchShortcutLabel()).toBe('Ctrl+K');
  });

  it('returns ⌘K for Mac', () => {
    vi.stubGlobal('navigator', { platform: 'MacIntel' });
    expect(getSearchShortcutLabel()).toBe('⌘K');
  });
});
