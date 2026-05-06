import { fireEvent, render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import {
  THEME_PREFERENCE_CHANGED_EVENT,
  THEME_STORAGE_KEY,
} from '../lib/theme';

function mockMatchMedia(matches: boolean) {
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.spyOn(window, 'matchMedia').mockImplementation(
    () => mql as unknown as MediaQueryList
  );
  return mql;
}

function getChangeHandler(mql: {
  addEventListener: ReturnType<typeof vi.fn>;
}): () => void {
  const call = mql.addEventListener.mock.calls.find(
    (c: unknown[]) => c[0] === 'change'
  );
  if (!call) throw new Error('no change listener on matchMedia mock');
  return call[1] as () => void;
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-color-scheme');
  });

  it('defaults to system and applies resolved scheme to the document', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe(
      'light'
    );
  });

  it('persists light preference to localStorage', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe(
      'light'
    );
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('updates resolved scheme when system preference changes', () => {
    const mql = mockMatchMedia(false);
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe(
      'light'
    );
    mql.matches = true;
    act(() => {
      getChangeHandler(mql)();
    });
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe(
      'dark'
    );
  });

  it('reacts to same-tab preference changes via custom event', () => {
    render(<ThemeToggle />);
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    act(() => {
      window.dispatchEvent(new Event(THEME_PREFERENCE_CHANGED_EVENT));
    });
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe(
      'dark'
    );
  });
});
