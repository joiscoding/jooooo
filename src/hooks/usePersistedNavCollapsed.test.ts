import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY } from '../constants/navStorage';
import { usePersistedNavCollapsed } from './usePersistedNavCollapsed';

const storage = (() => {
  let store: Record<string, string> = {};
  return {
    clear() {
      store = {};
    },
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
  };
})();

describe('usePersistedNavCollapsed', () => {
  afterEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', storage as Storage);
  });

  it('reads initial collapsed state from localStorage', async () => {
    storage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, '1');
    vi.stubGlobal('localStorage', storage as Storage);

    const { result } = renderHook(() => usePersistedNavCollapsed());
    await waitFor(() => expect(result.current.collapsed).toBe(true));
  });

  it('persists when toggled', async () => {
    vi.stubGlobal('localStorage', storage as Storage);
    const { result } = renderHook(() => usePersistedNavCollapsed());

    await waitFor(() => expect(result.current.collapsed).toBe(false));

    act(() => {
      result.current.toggleCollapsed();
    });
    expect(result.current.collapsed).toBe(true);
    expect(storage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe('1');

    act(() => {
      result.current.toggleCollapsed();
    });
    expect(result.current.collapsed).toBe(false);
    expect(storage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
  });
});
