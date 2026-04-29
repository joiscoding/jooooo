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

  it('defaults to expanded when unset', () => {
    expect(readNavCollapsed()).toBe(false);
  });

  it('reads true from "1" and "true"', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '1');
    expect(readNavCollapsed()).toBe(true);
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'true');
    expect(readNavCollapsed()).toBe(true);
  });

  it('reads false from "0" and "false"', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '0');
    expect(readNavCollapsed()).toBe(false);
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'false');
    expect(readNavCollapsed()).toBe(false);
  });

  it('treats unknown values as expanded', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'maybe');
    expect(readNavCollapsed()).toBe(false);
  });

  it('persists collapsed state', () => {
    writeNavCollapsed(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('1');
    expect(readNavCollapsed()).toBe(true);
    writeNavCollapsed(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
    expect(readNavCollapsed()).toBe(false);
  });
});
