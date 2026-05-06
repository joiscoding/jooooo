import { describe, expect, it } from 'vitest';
import { isEditableElement, isSearchFocusShortcut } from './searchShortcut';

function dispatchKeyDown(
  target: EventTarget,
  init: KeyboardEventInit,
): KeyboardEvent {
  const ev = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(ev);
  return ev;
}

describe('isSearchFocusShortcut', () => {
  it('returns true for metaKey+K from body', () => {
    const ev = dispatchKeyDown(document.body, { key: 'k', metaKey: true });
    expect(isSearchFocusShortcut(ev)).toBe(true);
  });

  it('returns true for ctrlKey+K', () => {
    const ev = dispatchKeyDown(document.body, { key: 'K', ctrlKey: true });
    expect(isSearchFocusShortcut(ev)).toBe(true);
  });

  it('returns false when shift is held', () => {
    const ev = dispatchKeyDown(document.body, {
      key: 'k',
      metaKey: true,
      shiftKey: true,
    });
    expect(isSearchFocusShortcut(ev)).toBe(false);
  });

  it('returns false inside a text input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    const ev = dispatchKeyDown(input, { key: 'k', metaKey: true });
    expect(isSearchFocusShortcut(ev)).toBe(false);
    input.remove();
  });

  it('returns false on repeat', () => {
    const ev = dispatchKeyDown(document.body, {
      key: 'k',
      metaKey: true,
      repeat: true,
    });
    expect(isSearchFocusShortcut(ev)).toBe(false);
  });
});

describe('isEditableElement', () => {
  it('detects textarea', () => {
    const el = document.createElement('textarea');
    expect(isEditableElement(el)).toBe(true);
  });

  it('detects contenteditable', () => {
    const el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    expect(isEditableElement(el)).toBe(true);
  });
});
