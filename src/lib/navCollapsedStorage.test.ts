import { afterEach, describe, expect, it } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navCollapsedStorage';

describe('navCollapsedStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to expanded when unset', () => {
    expect(readNavCollapsed()).toBe(false);
  });

  it('reads true from "1" or "true"', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '1');
    expect(readNavCollapsed()).toBe(true);
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'true');
    expect(readNavCollapsed()).toBe(true);
  });

  it('writes 0 and 1', () => {
    writeNavCollapsed(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('1');
    writeNavCollapsed(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
  });
});
