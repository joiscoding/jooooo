/**
 * @vitest-environment jsdom
 */
import { createRoot, type Root } from 'react-dom/client';
import { act, createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../theme/constants';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('ThemeToggle', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-preference');
    document.documentElement.style.colorScheme = '';
    mockMatchMedia(false);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    localStorage.clear();
  });

  function renderToggle() {
    act(() => {
      root.render(
        createElement(ThemeProvider, null, createElement(ThemeToggle)),
      );
    });
  }

  function button(label: string) {
    const el = container.querySelector(`[aria-label="${label}"]`);
    if (!(el instanceof HTMLButtonElement)) {
      throw new Error(`Missing button: ${label}`);
    }
    return el;
  }

  it('defaults to system and resolves to the OS scheme', () => {
    renderToggle();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.dataset.themePreference).toBe('system');
    expect(button('System theme').getAttribute('aria-pressed')).toBe('true');
  });

  it('applies dark to data-theme and lookbook-theme storage', () => {
    renderToggle();
    act(() => {
      button('Dark theme').click();
    });
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.themePreference).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(button('Dark theme').getAttribute('aria-pressed')).toBe('true');
  });

  it('applies light even when the OS prefers dark', () => {
    mockMatchMedia(true);
    renderToggle();
    act(() => {
      button('Light theme').click();
    });
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('follows prefers-color-scheme when System is selected', () => {
    mockMatchMedia(true);
    renderToggle();
    act(() => {
      button('Dark theme').click();
    });
    act(() => {
      button('System theme').click();
    });
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  });
});
