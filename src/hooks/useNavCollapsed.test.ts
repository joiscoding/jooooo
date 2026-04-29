import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useNavCollapsed,
  NAV_COLLAPSED_STORAGE_KEY,
} from './useNavCollapsed';

describe('useNavCollapsed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to expanded when storage is empty', () => {
    const { result } = renderHook(() => useNavCollapsed());
    expect(result.current.collapsed).toBe(false);
  });

  it('reads true from localStorage', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, '1');
    const { result } = renderHook(() => useNavCollapsed());
    expect(result.current.collapsed).toBe(true);
  });

  it('toggleCollapsed flips state and persists', () => {
    const { result } = renderHook(() => useNavCollapsed());
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

  it('setCollapsedState writes storage', () => {
    const { result } = renderHook(() => useNavCollapsed());
    act(() => {
      result.current.setCollapsedState(true);
    });
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('1');
  });
});
