import { describe, expect, it } from 'vitest';
import {
  getSearchShortcutParts,
  isGlobalSearchShortcut,
} from './globalSearchShortcut';

describe('isGlobalSearchShortcut', () => {
  it('detects Meta+K', () => {
    expect(
      isGlobalSearchShortcut({
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        repeat: false,
      }),
    ).toBe(true);
  });

  it('detects Ctrl+K', () => {
    expect(
      isGlobalSearchShortcut({
        key: 'k',
        metaKey: false,
        ctrlKey: true,
        altKey: false,
        shiftKey: false,
        repeat: false,
      }),
    ).toBe(true);
  });

  it('is case-insensitive on key', () => {
    expect(
      isGlobalSearchShortcut({
        key: 'K',
        metaKey: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        repeat: false,
      }),
    ).toBe(true);
  });

  it('rejects plain K', () => {
    expect(
      isGlobalSearchShortcut({
        key: 'k',
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        repeat: false,
      }),
    ).toBe(false);
  });

  it('rejects when Shift is held', () => {
    expect(
      isGlobalSearchShortcut({
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: true,
        repeat: false,
      }),
    ).toBe(false);
  });

  it('rejects key repeat', () => {
    expect(
      isGlobalSearchShortcut({
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        repeat: true,
      }),
    ).toBe(false);
  });
});

describe('getSearchShortcutParts', () => {
  it('returns a non-empty shortcut', () => {
    const parts = getSearchShortcutParts();
    expect(parts.key).toBe('K');
    expect(['Ctrl', '⌘']).toContain(parts.modifier);
  });
});
