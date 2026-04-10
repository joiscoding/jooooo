import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { isGlobalSearchShortcut } from './isGlobalSearchShortcut';

function makeKeyDown(init: Partial<KeyboardEvent> & { key: string }): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...init,
  });
}

describe('isGlobalSearchShortcut', () => {
  const originalPlatform = navigator.platform;

  beforeEach(() => {
    vi.stubGlobal('navigator', { ...navigator, platform: 'MacIntel' });
  });

  afterEach(() => {
    vi.stubGlobal('navigator', { ...navigator, platform: originalPlatform });
    vi.unstubAllGlobals();
  });

  it('returns true for Meta+K on Mac when target is body', () => {
    const ev = makeKeyDown({ key: 'k', metaKey: true, ctrlKey: false });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchShortcut(ev)).toBe(true);
  });

  it('returns false when Ctrl+K on Mac (avoid browser find bar conflict path)', () => {
    const ev = makeKeyDown({ key: 'k', metaKey: false, ctrlKey: true });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchShortcut(ev)).toBe(false);
  });

  it('returns false inside input', () => {
    const input = document.createElement('input');
    const ev = makeKeyDown({ key: 'k', metaKey: true });
    Object.defineProperty(ev, 'target', { value: input, enumerable: true });
    expect(isGlobalSearchShortcut(ev)).toBe(false);
  });

  it('uses Ctrl+K on non-Mac', () => {
    vi.stubGlobal('navigator', { ...navigator, platform: 'Win32' });
    const ev = makeKeyDown({ key: 'k', metaKey: false, ctrlKey: true });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchShortcut(ev)).toBe(true);
  });

  it('returns false on repeat', () => {
    const ev = makeKeyDown({ key: 'k', metaKey: true, repeat: true });
    Object.defineProperty(ev, 'target', { value: document.body, enumerable: true });
    expect(isGlobalSearchShortcut(ev)).toBe(false);
  });
});
