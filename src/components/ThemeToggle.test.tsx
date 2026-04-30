import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { LOOKBOOK_THEME_STORAGE_KEY } from '../theme/theme';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    });
    window.matchMedia = vi.fn(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-theme');
  });

  it('cycles preference and updates document theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Dark' }));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOOKBOOK_THEME_STORAGE_KEY,
      'dark'
    );
    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Light' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
