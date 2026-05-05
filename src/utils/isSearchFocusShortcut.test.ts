import { describe, expect, it } from 'vitest';
import { isSearchFocusShortcut } from './isSearchFocusShortcut';

function makeKeyEvent(init: Partial<KeyboardEvent> & { key: string }): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key: init.key,
    metaKey: init.metaKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    altKey: init.altKey ?? false,
    shiftKey: init.shiftKey ?? false,
    repeat: init.repeat ?? false,
    bubbles: true,
    cancelable: true,
  });
}

describe('isSearchFocusShortcut', () => {
  it('returns true for ⌘+K / Meta+K', () => {
    expect(
      isSearchFocusShortcut(makeKeyEvent({ key: 'k', metaKey: true })),
    ).toBe(true);
    expect(
      isSearchFocusShortcut(makeKeyEvent({ key: 'K', metaKey: true })),
    ).toBe(true);
  });

  it('returns true for Ctrl+K', () => {
    expect(
      isSearchFocusShortcut(makeKeyEvent({ key: 'k', ctrlKey: true })),
    ).toBe(true);
  });

  it('returns false without modifier', () => {
    expect(isSearchFocusShortcut(makeKeyEvent({ key: 'k' }))).toBe(false);
  });

  it('returns false for other keys with modifiers', () => {
    expect(
      isSearchFocusShortcut(makeKeyEvent({ key: 'j', metaKey: true })),
    ).toBe(false);
  });

  it('returns false when Alt or Shift is held', () => {
    expect(
      isSearchFocusShortcut(
        makeKeyEvent({ key: 'k', metaKey: true, altKey: true }),
      ),
    ).toBe(false);
    expect(
      isSearchFocusShortcut(
        makeKeyEvent({ key: 'k', ctrlKey: true, shiftKey: true }),
      ),
    ).toBe(false);
  });

  it('returns false for repeat keydown', () => {
    expect(
      isSearchFocusShortcut(
        makeKeyEvent({ key: 'k', metaKey: true, repeat: true }),
      ),
    ).toBe(false);
  });

  it('returns false when default was already prevented', () => {
    const ev = makeKeyEvent({ key: 'k', metaKey: true });
    ev.preventDefault();
    expect(isSearchFocusShortcut(ev)).toBe(false);
  });
});
