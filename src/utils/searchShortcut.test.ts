import { describe, expect, it, vi, afterEach } from 'vitest';
import { isSearchFocusShortcut, getSearchShortcutLabel } from './searchShortcut';

function keyEvent(
  overrides: Partial<KeyboardEvent> & { key: string },
): KeyboardEvent {
  return {
    key: overrides.key,
    metaKey: overrides.metaKey ?? false,
    ctrlKey: overrides.ctrlKey ?? false,
    altKey: overrides.altKey ?? false,
    preventDefault: overrides.preventDefault ?? vi.fn(),
  } as KeyboardEvent;
}

describe('isSearchFocusShortcut', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('matches meta+k on macOS', () => {
    vi.stubGlobal('navigator', {
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    });

    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', metaKey: true })),
    ).toBe(true);
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', ctrlKey: true })),
    ).toBe(false);
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', metaKey: true, altKey: true })),
    ).toBe(false);
  });

  it('matches ctrl+k on non-macOS', () => {
    vi.stubGlobal('navigator', {
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
    });

    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', ctrlKey: true })),
    ).toBe(true);
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', metaKey: true })),
    ).toBe(false);
  });

  it('is case-insensitive for the k key', () => {
    vi.stubGlobal('navigator', {
      platform: 'Win32',
      userAgent: 'Mozilla/5.0',
    });

    expect(
      isSearchFocusShortcut(keyEvent({ key: 'K', ctrlKey: true })),
    ).toBe(true);
  });

  it('ignores other keys', () => {
    vi.stubGlobal('navigator', {
      platform: 'Win32',
      userAgent: 'Mozilla/5.0',
    });

    expect(
      isSearchFocusShortcut(keyEvent({ key: 'j', ctrlKey: true })),
    ).toBe(false);
  });
});

describe('getSearchShortcutLabel', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns ⌘K on macOS', () => {
    vi.stubGlobal('navigator', {
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 (Macintosh)',
    });
    expect(getSearchShortcutLabel()).toBe('⌘K');
  });

  it('returns Ctrl+K on Windows', () => {
    vi.stubGlobal('navigator', {
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT)',
    });
    expect(getSearchShortcutLabel()).toBe('Ctrl+K');
  });
});
