import { describe, expect, it, beforeEach } from 'vitest';
import {
  LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navCollapsedStorage';

function makeMemoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k: string) => m.get(k) ?? null,
    key: (i: number) => [...m.keys()][i] ?? null,
    removeItem: (k: string) => {
      m.delete(k);
    },
    setItem: (k: string, v: string) => {
      m.set(k, v);
    },
  };
}

describe('navCollapsedStorage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = makeMemoryStorage();
  });

  it('defaults to expanded (false) when unset', () => {
    expect(readNavCollapsed(storage)).toBe(false);
  });

  it('reads true for 1 and true', () => {
    storage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, '1');
    expect(readNavCollapsed(storage)).toBe(true);
    storage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, 'true');
    expect(readNavCollapsed(storage)).toBe(true);
  });

  it('reads false for 0 and false', () => {
    storage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, '0');
    expect(readNavCollapsed(storage)).toBe(false);
    storage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, 'false');
    expect(readNavCollapsed(storage)).toBe(false);
  });

  it('writeNavCollapsed persists 1 or 0', () => {
    writeNavCollapsed(storage, true);
    expect(storage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe('1');
    writeNavCollapsed(storage, false);
    expect(storage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
  });
});
