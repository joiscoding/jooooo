import { describe, expect, it } from 'vitest';
import { isGlobalSearchFocusShortcut } from './searchShortcut';

function ev(
  partial: Partial<{
    key: string;
    metaKey: boolean;
    ctrlKey: boolean;
    repeat: boolean;
    defaultPrevented: boolean;
  }>,
) {
  return {
    key: 'k',
    metaKey: false,
    ctrlKey: false,
    repeat: false,
    defaultPrevented: false,
    ...partial,
  };
}

describe('isGlobalSearchFocusShortcut', () => {
  it('matches ⌘K', () => {
    expect(
      isGlobalSearchFocusShortcut(ev({ key: 'k', metaKey: true })),
    ).toBe(true);
    expect(
      isGlobalSearchFocusShortcut(ev({ key: 'K', metaKey: true })),
    ).toBe(true);
  });

  it('matches Ctrl+K', () => {
    expect(
      isGlobalSearchFocusShortcut(ev({ key: 'k', ctrlKey: true })),
    ).toBe(true);
  });

  it('matches meta+ctrl with K (some platforms)', () => {
    expect(
      isGlobalSearchFocusShortcut(
        ev({ key: 'k', metaKey: true, ctrlKey: true }),
      ),
    ).toBe(true);
  });

  it('ignores K without modifier', () => {
    expect(isGlobalSearchFocusShortcut(ev({ key: 'k' }))).toBe(false);
  });

  it('ignores repeat and defaultPrevented', () => {
    expect(
      isGlobalSearchFocusShortcut(ev({ metaKey: true, repeat: true })),
    ).toBe(false);
    expect(
      isGlobalSearchFocusShortcut(
        ev({ metaKey: true, defaultPrevented: true }),
      ),
    ).toBe(false);
  });

  it('ignores other keys with modifiers', () => {
    expect(
      isGlobalSearchFocusShortcut(ev({ key: 'j', metaKey: true })),
    ).toBe(false);
  });
});
