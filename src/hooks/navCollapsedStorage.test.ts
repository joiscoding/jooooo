import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navCollapsedStorage';

describe('navCollapsedStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('readNavCollapsed returns false when unset', () => {
    expect(readNavCollapsed()).toBe(false);
  });

  it('readNavCollapsed returns true when stored as 1', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '1');
    expect(readNavCollapsed()).toBe(true);
  });

  it('readNavCollapsed returns false for 0', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '0');
    expect(readNavCollapsed()).toBe(false);
  });

  it('writeNavCollapsed persists 1 and 0', () => {
    writeNavCollapsed(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('1');
    writeNavCollapsed(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
  });
});
