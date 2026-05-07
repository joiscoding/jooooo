import { describe, expect, it } from 'vitest';
import {
  LOOKBOOK_NAV_COLLAPSED_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navStorage';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
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
  } as Storage;
}

describe('navStorage', () => {
  it('defaults to expanded when key missing', () => {
    const s = createMemoryStorage();
    expect(readNavCollapsed(s)).toBe(false);
  });

  it('reads collapsed when stored as 1', () => {
    const s = createMemoryStorage();
    s.setItem(LOOKBOOK_NAV_COLLAPSED_KEY, '1');
    expect(readNavCollapsed(s)).toBe(true);
  });

  it('writes 1 and 0 for collapsed and expanded', () => {
    const s = createMemoryStorage();
    writeNavCollapsed(s, true);
    expect(s.getItem(LOOKBOOK_NAV_COLLAPSED_KEY)).toBe('1');
    writeNavCollapsed(s, false);
    expect(s.getItem(LOOKBOOK_NAV_COLLAPSED_KEY)).toBe('0');
  });
});
