import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsedFromStorage,
  writeNavCollapsedToStorage,
} from './storage';

describe('nav storage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('defaults to expanded when key missing', () => {
    expect(readNavCollapsedFromStorage()).toBe(false);
  });

  it('reads true/false from localStorage', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'true');
    expect(readNavCollapsedFromStorage()).toBe(true);
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'false');
    expect(readNavCollapsedFromStorage()).toBe(false);
  });

  it('returns default when value is invalid', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'maybe');
    expect(readNavCollapsedFromStorage()).toBe(false);
  });

  it('returns default when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(readNavCollapsedFromStorage()).toBe(false);
  });

  it('writes boolean as string', () => {
    writeNavCollapsedToStorage(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
    writeNavCollapsedToStorage(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('false');
  });

  it('ignores write errors', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => writeNavCollapsedToStorage(true)).not.toThrow();
  });
});
