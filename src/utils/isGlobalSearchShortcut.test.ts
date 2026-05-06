import { describe, expect, it } from 'vitest';
import { isGlobalSearchShortcut } from './isGlobalSearchShortcut';

function keydown(init: KeyboardEventInit) {
  return new KeyboardEvent('keydown', init);
}

describe('isGlobalSearchShortcut', () => {
  it('matches Meta+K', () => {
    expect(isGlobalSearchShortcut(keydown({ key: 'k', metaKey: true }))).toBe(
      true,
    );
    expect(isGlobalSearchShortcut(keydown({ key: 'K', metaKey: true }))).toBe(
      true,
    );
  });

  it('matches Ctrl+K', () => {
    expect(
      isGlobalSearchShortcut(keydown({ key: 'k', ctrlKey: true })),
    ).toBe(true);
  });

  it('rejects plain K and modifier-only combos', () => {
    expect(isGlobalSearchShortcut(keydown({ key: 'k' }))).toBe(false);
    expect(
      isGlobalSearchShortcut(keydown({ key: 'k', shiftKey: true })),
    ).toBe(false);
    expect(
      isGlobalSearchShortcut(keydown({ key: 'k', altKey: true, ctrlKey: true })),
    ).toBe(false);
  });

  it('rejects Meta+Ctrl+K together', () => {
    expect(
      isGlobalSearchShortcut(
        keydown({ key: 'k', metaKey: true, ctrlKey: true }),
      ),
    ).toBe(false);
  });

  it('ignores repeat', () => {
    const ev = keydown({ key: 'k', metaKey: true, repeat: true });
    expect(isGlobalSearchShortcut(ev)).toBe(false);
  });
});
