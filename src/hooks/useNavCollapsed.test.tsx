import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useNavCollapsed } from './useNavCollapsed';
import { NAV_COLLAPSED_STORAGE_KEY } from '../nav/storage';

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useNavCollapsed', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('reflects stored value on mount', () => {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, 'true');
    const { result } = renderHook(() => useNavCollapsed(), { wrapper });
    expect(result.current[0]).toBe(true);
  });

  it('toggle updates state and persists', () => {
    const { result } = renderHook(() => useNavCollapsed(), { wrapper });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('true');

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)).toBe('false');
  });
});
