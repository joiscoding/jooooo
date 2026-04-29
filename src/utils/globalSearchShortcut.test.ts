import { describe, expect, it } from 'vitest';
import {
  getSearchShortcutHint,
  isEditableShortcutTarget,
  isGlobalSearchFocusShortcut,
} from './globalSearchShortcut';

function key(
  init: Partial<KeyboardEvent> & Pick<KeyboardEvent, 'key'>,
): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...init,
  });
}

describe('isGlobalSearchFocusShortcut', () => {
  it('matches Meta+K', () => {
    expect(isGlobalSearchFocusShortcut(key({ key: 'k', metaKey: true }))).toBe(
      true,
    );
    expect(isGlobalSearchFocusShortcut(key({ key: 'K', metaKey: true }))).toBe(
      true,
    );
  });

  it('matches Ctrl+K', () => {
    expect(
      isGlobalSearchFocusShortcut(key({ key: 'k', ctrlKey: true })),
    ).toBe(true);
  });

  it('rejects Alt+Meta+K', () => {
    expect(
      isGlobalSearchFocusShortcut(
        key({ key: 'k', metaKey: true, altKey: true }),
      ),
    ).toBe(false);
  });

  it('rejects plain K', () => {
    expect(isGlobalSearchFocusShortcut(key({ key: 'k' }))).toBe(false);
  });

  it('rejects repeat', () => {
    expect(
      isGlobalSearchFocusShortcut(
        key({ key: 'k', metaKey: true, repeat: true }),
      ),
    ).toBe(false);
  });
});

describe('isEditableShortcutTarget', () => {
  it('returns false for non-editable targets', () => {
    const div = document.createElement('div');
    expect(isEditableShortcutTarget(div, null)).toBe(false);
  });

  it('returns true inside a foreign text field', () => {
    const wrap = document.createElement('div');
    const input = document.createElement('input');
    wrap.appendChild(input);
    document.body.appendChild(wrap);
    try {
      expect(isEditableShortcutTarget(input, null)).toBe(true);
    } finally {
      wrap.remove();
    }
  });

  it('returns false when target is the designated search input', () => {
    const search = document.createElement('input');
    search.type = 'search';
    expect(isEditableShortcutTarget(search, search)).toBe(false);
  });
});

describe('getSearchShortcutHint', () => {
  it('returns a non-empty hint', () => {
    const hint = getSearchShortcutHint();
    expect(hint === '⌘K' || hint === 'Ctrl+K').toBe(true);
  });
});
