import { describe, expect, it } from 'vitest';
import { isSearchFocusShortcut } from './searchShortcut';

function keyEvent(
  overrides: Partial<KeyboardEvent> & Pick<KeyboardEvent, 'key'>,
): KeyboardEvent {
  return {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...overrides,
  } as KeyboardEvent;
}

describe('isSearchFocusShortcut', () => {
  it('matches Meta+K', () => {
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', metaKey: true })),
    ).toBe(true);
  });

  it('matches Ctrl+K', () => {
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', ctrlKey: true })),
    ).toBe(true);
  });

  it('matches uppercase K with modifiers', () => {
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'K', metaKey: true })),
    ).toBe(true);
  });

  it('rejects plain k', () => {
    expect(isSearchFocusShortcut(keyEvent({ key: 'k' }))).toBe(false);
  });

  it('rejects Meta+Shift+K', () => {
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', metaKey: true, shiftKey: true })),
    ).toBe(false);
  });

  it('rejects Ctrl+Alt+K', () => {
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'k', ctrlKey: true, altKey: true })),
    ).toBe(false);
  });

  it('rejects other keys with Meta', () => {
    expect(
      isSearchFocusShortcut(keyEvent({ key: 'j', metaKey: true })),
    ).toBe(false);
  });
});
