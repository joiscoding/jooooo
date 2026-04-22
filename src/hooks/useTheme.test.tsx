import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from './useTheme';
import { THEME_STORAGE_KEY } from '../theme';

function setMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: q === '(prefers-color-scheme: dark)' ? matches : false,
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme-preference');
    setMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to system and applies light when OS is light', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe('system');
    expect(document.documentElement.dataset.colorScheme).toBe('light');
  });

  it('persists preference to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('dark');
    });
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(result.current.preference).toBe('dark');
    expect(document.documentElement.dataset.colorScheme).toBe('dark');
  });

  it('updates when system preference changes', () => {
    setMatchMedia(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'system');
    document.documentElement.dataset.themePreference = 'system';
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe('system');
    expect(document.documentElement.dataset.colorScheme).toBe('dark');
  });
});
