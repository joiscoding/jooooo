import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  useNavSidebarCollapsed,
} from './useNavSidebarCollapsed';

function mockMatchMedia(matches: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('useNavSidebarCollapsed', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', mockMatchMedia(true));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to expanded and persists toggle', () => {
    const { result } = renderHook(() => useNavSidebarCollapsed());

    expect(result.current.collapsed).toBe(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe(null);

    act(() => {
      result.current.toggleCollapsed();
    });

    expect(result.current.collapsed).toBe(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('1');

    act(() => {
      result.current.toggleCollapsed();
    });

    expect(result.current.collapsed).toBe(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
  });

  it('reads initial collapsed state from localStorage', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '1');
    const { result } = renderHook(() => useNavSidebarCollapsed());
    expect(result.current.collapsed).toBe(true);
  });

  it('reports isDesktop false when matchMedia is narrow', () => {
    vi.stubGlobal('matchMedia', mockMatchMedia(false));
    const { result } = renderHook(() => useNavSidebarCollapsed());
    expect(result.current.isDesktop).toBe(false);
  });
});
