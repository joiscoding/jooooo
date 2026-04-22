import { afterEach, describe, expect, it } from 'vitest';
import {
  getNavCollapsed,
  NAV_COLLAPSED_KEY,
  setNavCollapsed,
  resetNavStorageForTests,
  setNavStorageOverride,
} from './navSidebarStorage';

function makeMemoryStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => {
      m.set(k, v);
    },
  };
}

describe('navSidebarStorage', () => {
  afterEach(() => {
    resetNavStorageForTests();
  });

  it('defaults to expanded when key is absent', () => {
    setNavStorageOverride(makeMemoryStore());
    expect(getNavCollapsed()).toBe(false);
  });

  it('persists and reads collapsed state as 1 and 0', () => {
    const s = makeMemoryStore();
    setNavStorageOverride(s);
    setNavCollapsed(true);
    expect(s.getItem(NAV_COLLAPSED_KEY)).toBe('1');
    expect(getNavCollapsed()).toBe(true);
    setNavCollapsed(false);
    expect(s.getItem(NAV_COLLAPSED_KEY)).toBe('0');
    expect(getNavCollapsed()).toBe(false);
  });
});
