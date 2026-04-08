import { describe, expect, it } from 'vitest';
import { isCommandKShortcut } from './isCommandKShortcut';

const ID = 'global-search-input';

function dispatchKeyDown(
  el: EventTarget,
  init: KeyboardEventInit,
): KeyboardEvent {
  const ev = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  el.dispatchEvent(ev);
  return ev;
}

describe('isCommandKShortcut', () => {
  it('returns true for Ctrl+K on document body', () => {
    const ev = dispatchKeyDown(document.body, { key: 'k', ctrlKey: true });
    expect(isCommandKShortcut(ev, ID)).toBe(true);
  });

  it('returns true for Meta+K on document body', () => {
    const ev = dispatchKeyDown(document.body, { key: 'K', metaKey: true });
    expect(isCommandKShortcut(ev, ID)).toBe(true);
  });

  it('returns false without modifier', () => {
    const ev = dispatchKeyDown(document.body, { key: 'k' });
    expect(isCommandKShortcut(ev, ID)).toBe(false);
  });

  it('returns false when Alt is held', () => {
    const ev = dispatchKeyDown(document.body, {
      key: 'k',
      ctrlKey: true,
      altKey: true,
    });
    expect(isCommandKShortcut(ev, ID)).toBe(false);
  });

  it('returns false when typing in another text input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    const ev = dispatchKeyDown(input, { key: 'k', ctrlKey: true });
    expect(isCommandKShortcut(ev, ID)).toBe(false);
    document.body.removeChild(input);
  });

  it('returns true when focus is the global search input', () => {
    const input = document.createElement('input');
    input.id = ID;
    document.body.appendChild(input);
    const ev = dispatchKeyDown(input, { key: 'k', ctrlKey: true });
    expect(isCommandKShortcut(ev, ID)).toBe(true);
    document.body.removeChild(input);
  });
});
