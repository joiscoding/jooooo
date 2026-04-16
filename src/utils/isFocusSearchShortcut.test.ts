import { describe, expect, it } from 'vitest';
import { isFocusSearchShortcut } from './isFocusSearchShortcut';

function ev(
  partial: Partial<KeyboardEvent> & Pick<KeyboardEvent, 'key'>,
): Pick<
  KeyboardEvent,
  | 'key'
  | 'metaKey'
  | 'ctrlKey'
  | 'altKey'
  | 'shiftKey'
  | 'defaultPrevented'
  | 'repeat'
  | 'isComposing'
> {
  return {
    key: partial.key,
    metaKey: partial.metaKey ?? false,
    ctrlKey: partial.ctrlKey ?? false,
    altKey: partial.altKey ?? false,
    shiftKey: partial.shiftKey ?? false,
    defaultPrevented: partial.defaultPrevented ?? false,
    repeat: partial.repeat ?? false,
    isComposing: partial.isComposing ?? false,
  };
}

describe('isFocusSearchShortcut', () => {
  it('matches meta+k', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k', metaKey: true }))).toBe(true);
    expect(isFocusSearchShortcut(ev({ key: 'K', metaKey: true }))).toBe(true);
  });

  it('matches ctrl+k', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k', ctrlKey: true }))).toBe(true);
  });

  it('rejects when both meta and ctrl', () => {
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, ctrlKey: true })),
    ).toBe(false);
  });

  it('rejects alt or shift modifiers', () => {
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, altKey: true })),
    ).toBe(false);
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, shiftKey: true })),
    ).toBe(false);
  });

  it('rejects repeat, composing, defaultPrevented', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k', metaKey: true, repeat: true }))).toBe(
      false,
    );
    expect(
      isFocusSearchShortcut(ev({ key: 'k', metaKey: true, isComposing: true })),
    ).toBe(false);
    expect(
      isFocusSearchShortcut(
        ev({ key: 'k', metaKey: true, defaultPrevented: true }),
      ),
    ).toBe(false);
  });

  it('rejects plain k', () => {
    expect(isFocusSearchShortcut(ev({ key: 'k' }))).toBe(false);
  });
});
