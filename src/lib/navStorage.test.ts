import { afterEach, describe, expect, it } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navStorage';

describe('navStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('readNavCollapsed returns fallback when key missing', () => {
    expect(readNavCollapsed(true)).toBe(true);
    expect(readNavCollapsed(false)).toBe(false);
  });

  it('writeNavCollapsed and readNavCollapsed round-trip', () => {
    writeNavCollapsed(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('1');
    expect(readNavCollapsed(false)).toBe(true);

    writeNavCollapsed(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
    expect(readNavCollapsed(true)).toBe(false);
  });

  it('readNavCollapsed ignores invalid values', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'maybe');
    expect(readNavCollapsed(true)).toBe(true);
  });
});
