import { describe, expect, it } from 'vitest';
import {
  isGlobalSearchFocusShortcut,
  isOtherEditableTarget,
} from './globalSearchShortcut';

describe('isGlobalSearchFocusShortcut', () => {
  it('matches Meta+K / meta+k', () => {
    expect(
      isGlobalSearchFocusShortcut({
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        repeat: false,
        defaultPrevented: false,
      }),
    ).toBe(true);
    expect(
      isGlobalSearchFocusShortcut({
        key: 'K',
        metaKey: true,
        ctrlKey: false,
        repeat: false,
        defaultPrevented: false,
      }),
    ).toBe(true);
  });

  it('matches Ctrl+K', () => {
    expect(
      isGlobalSearchFocusShortcut({
        key: 'k',
        metaKey: false,
        ctrlKey: true,
        repeat: false,
        defaultPrevented: false,
      }),
    ).toBe(true);
  });

  it('ignores repeat and defaultPrevented', () => {
    expect(
      isGlobalSearchFocusShortcut({
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        repeat: true,
        defaultPrevented: false,
      }),
    ).toBe(false);
    expect(
      isGlobalSearchFocusShortcut({
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        repeat: false,
        defaultPrevented: true,
      }),
    ).toBe(false);
  });

  it('ignores plain K and modifier-only', () => {
    expect(
      isGlobalSearchFocusShortcut({
        key: 'k',
        metaKey: false,
        ctrlKey: false,
        repeat: false,
        defaultPrevented: false,
      }),
    ).toBe(false);
    expect(
      isGlobalSearchFocusShortcut({
        key: 'j',
        metaKey: true,
        ctrlKey: false,
        repeat: false,
        defaultPrevented: false,
      }),
    ).toBe(false);
  });
});

describe('isOtherEditableTarget', () => {
  it('treats global search input as not other-editable', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const input = document.createElement('input');
    input.setAttribute('data-global-search-input', '');
    root.appendChild(input);
    expect(isOtherEditableTarget(input)).toBe(false);
    document.body.removeChild(root);
  });

  it('treats foreign inputs as other-editable', () => {
    const input = document.createElement('input');
    expect(isOtherEditableTarget(input)).toBe(true);
  });
});
