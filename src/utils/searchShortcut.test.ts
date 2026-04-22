import { describe, expect, it } from 'vitest';
import { isEditableEventTarget, isSearchFocusShortcut } from './searchShortcut';

function makeKeyEvent(init: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  repeat?: boolean;
}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key: init.key,
    metaKey: init.metaKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    repeat: init.repeat ?? false,
  });
}

describe('isSearchFocusShortcut', () => {
  it('returns true for Cmd+K and Ctrl+K', () => {
    expect(isSearchFocusShortcut(makeKeyEvent({ key: 'k', metaKey: true }))).toBe(
      true
    );
    expect(isSearchFocusShortcut(makeKeyEvent({ key: 'K', metaKey: true }))).toBe(
      true
    );
    expect(isSearchFocusShortcut(makeKeyEvent({ key: 'k', ctrlKey: true }))).toBe(
      true
    );
  });

  it('returns false for K without modifier', () => {
    expect(isSearchFocusShortcut(makeKeyEvent({ key: 'k' }))).toBe(false);
  });

  it('returns false for repeat', () => {
    expect(
      isSearchFocusShortcut(
        makeKeyEvent({ key: 'k', metaKey: true, repeat: true })
      )
    ).toBe(false);
  });

  it('returns false for other keys with modifiers', () => {
    expect(
      isSearchFocusShortcut(makeKeyEvent({ key: 'j', metaKey: true }))
    ).toBe(false);
  });
});

describe('isEditableEventTarget', () => {
  it('treats non-search inputs as editable', () => {
    const input = document.createElement('input');
    input.id = 'other';
    expect(isEditableEventTarget(input, 'global-lookbook-search')).toBe(true);
  });

  it('does not treat the global search input as blocking the shortcut', () => {
    const input = document.createElement('input');
    input.id = 'global-lookbook-search';
    expect(isEditableEventTarget(input, 'global-lookbook-search')).toBe(false);
  });
});
