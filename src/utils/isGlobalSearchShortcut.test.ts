import { describe, expect, it } from 'vitest';
import { isGlobalSearchShortcut } from './isGlobalSearchShortcut';

function ev(
  key: string,
  opts: { metaKey?: boolean; ctrlKey?: boolean; repeat?: boolean } = {},
): Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'repeat'> {
  return {
    key,
    metaKey: opts.metaKey ?? false,
    ctrlKey: opts.ctrlKey ?? false,
    repeat: opts.repeat ?? false,
  };
}

describe('isGlobalSearchShortcut', () => {
  it('matches Cmd+K (mac)', () => {
    expect(isGlobalSearchShortcut(ev('k', { metaKey: true }))).toBe(true);
    expect(isGlobalSearchShortcut(ev('K', { metaKey: true }))).toBe(true);
  });

  it('matches Ctrl+K (non-mac)', () => {
    expect(isGlobalSearchShortcut(ev('k', { ctrlKey: true }))).toBe(true);
  });

  it('rejects plain K', () => {
    expect(isGlobalSearchShortcut(ev('k'))).toBe(false);
  });

  it('rejects repeat chords', () => {
    expect(isGlobalSearchShortcut(ev('k', { metaKey: true, repeat: true }))).toBe(false);
  });

  it('rejects Meta+Ctrl+K', () => {
    expect(isGlobalSearchShortcut(ev('k', { metaKey: true, ctrlKey: true }))).toBe(false);
  });

  it('rejects other keys with modifiers', () => {
    expect(isGlobalSearchShortcut(ev('j', { metaKey: true }))).toBe(false);
  });
});
