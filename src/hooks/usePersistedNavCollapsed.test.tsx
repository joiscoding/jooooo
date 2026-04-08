import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { NAV_COLLAPSED_STORAGE_KEY } from '../lib/navCollapsedStorage';
import { usePersistedNavCollapsed } from './usePersistedNavCollapsed';

describe('usePersistedNavCollapsed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes from localStorage when set', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'true');
    const { result } = renderHook(() => usePersistedNavCollapsed());
    expect(result.current[0]).toBe(true);
  });

  it('persists toggle to localStorage', () => {
    const { result } = renderHook(() => usePersistedNavCollapsed());
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
    act(() => {
      result.current[1]();
    });
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('false');
  });
});
