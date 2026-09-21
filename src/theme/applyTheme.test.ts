/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest';
import { applyThemeToDocument } from './applyTheme';

afterEach(() => {
  const root = document.documentElement;
  delete root.dataset.theme;
  delete root.dataset.themePreference;
  root.style.colorScheme = '';
});

describe('applyThemeToDocument', () => {
  it('writes resolved theme, preference, and color-scheme on <html>', () => {
    applyThemeToDocument('dark', 'system');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.themePreference).toBe('system');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
