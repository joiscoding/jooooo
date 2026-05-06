import { describe, expect, it } from 'vitest';
import { isFocusSearchShortcut } from './isFocusSearchShortcut';

function ev(
  partial: Partial<KeyboardEvent> &
    Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'repeat'>,
): Pick<
  KeyboardEvent,
  'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'repeat'
> {
  return {
    key: partial.key,
    metaKey: partial.metaKey ?? false,
    ctrlKey: partial.ctrlKey ?? false,
    altKey: partial.altKey ?? false,
    shiftKey: partial.shiftKey ?? false,
    repeat: partial.repeat ?? false,
  };
}

describe('isFocusSearchShortcut', () => {
  it('returns true for ⌘K', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k', metaKey: true }))).toBe(true);
    expect(isFocusSearchShortcut(ev({ key: 'K', metaKey: true }))).toBe(true);
  });

  it('returns true for Ctrl+K', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k', ctrlKey: true }))).toBe(true);
  });

  it('returns false when K is pressed without modifier', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k' }))).toBe(false);
  });

  it('returns false for key repeat', () => {
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, repeat: true })),
    ).toBe(false);
  });

  it('returns false when Alt is held (avoid IME / browser chords)', () => {
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, altKey: true })),
    ).toBe(false);
  });

  it('returns false when Shift is held (narrower chord, fewer collisions)', () => {
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, shiftKey: true })),
    ).toBe(false);
  });

  it('returns false for unrelated keys', () => {
    expect(isFocusSearchShortcut(ev({ key: 'j', metaKey: true }))).toBe(false);
  });
});
