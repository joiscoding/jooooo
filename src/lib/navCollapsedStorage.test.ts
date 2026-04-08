import { describe, expect, it } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navCollapsedStorage';

function makeMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe('navCollapsedStorage', () => {
  it('uses the agreed localStorage key', () => {
    expect(NAV_COLLAPSED_STORAGE_KEY).toBe('lookbook_nav_collapsed_v1');
  });

  it('readNavCollapsed returns null for missing or invalid values', () => {
    const s = makeMemoryStorage();
    expect(readNavCollapsed(s)).toBeNull();
    s.setItem(NAV_COLLAPSED_STORAGE_KEY, 'maybe');
    expect(readNavCollapsed(s)).toBeNull();
  });

  it('round-trips boolean collapsed state', () => {
    const s = makeMemoryStorage();
    writeNavCollapsed(s, true);
    expect(readNavCollapsed(s)).toBe(true);
    expect(s.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
    writeNavCollapsed(s, false);
    expect(readNavCollapsed(s)).toBe(false);
  });

  it('readNavCollapsed returns null when storage is unavailable', () => {
    expect(readNavCollapsed(undefined)).toBeNull();
    expect(readNavCollapsed(null)).toBeNull();
  });
});
