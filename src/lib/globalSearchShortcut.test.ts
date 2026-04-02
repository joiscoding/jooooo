import { describe, expect, it } from 'vitest';
import { isGlobalSearchFocusShortcut } from './globalSearchShortcut';

function keyEvent(init: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  repeat?: boolean;
}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key: init.key,
    metaKey: init.metaKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    altKey: init.altKey ?? false,
    shiftKey: init.shiftKey ?? false,
    repeat: init.repeat ?? false,
    bubbles: true,
    cancelable: true,
  });
}

describe('isGlobalSearchFocusShortcut', () => {
  it('returns true for Ctrl+K with body target', () => {
    const ev = keyEvent({ key: 'k', ctrlKey: true });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(true);
  });

  it('returns true for Meta+K', () => {
    const ev = keyEvent({ key: 'K', metaKey: true });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(true);
  });

  it('returns false without modifier', () => {
    const ev = keyEvent({ key: 'k' });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(false);
  });

  it('returns false when repeat', () => {
    const ev = keyEvent({ key: 'k', ctrlKey: true, repeat: true });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(false);
  });

  it('returns false in a plain text input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    const ev = keyEvent({ key: 'k', ctrlKey: true });
    Object.defineProperty(ev, 'target', { value: input, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(false);
  });

  it('returns true inside global search host', () => {
    const host = document.createElement('div');
    host.setAttribute('data-global-search', 'true');
    const input = document.createElement('input');
    host.appendChild(input);
    const ev = keyEvent({ key: 'k', ctrlKey: true });
    Object.defineProperty(ev, 'target', { value: input, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(true);
  });

  it('returns true for checkbox input (not a text field)', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    const ev = keyEvent({ key: 'k', ctrlKey: true });
    Object.defineProperty(ev, 'target', { value: input, enumerable: true });
    expect(isGlobalSearchFocusShortcut(ev)).toBe(true);
  });
});
