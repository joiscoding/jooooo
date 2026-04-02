import { describe, expect, it } from 'vitest';
import { resolveEffectiveTheme } from './themePreference';

describe('resolveEffectiveTheme', () => {
  it('uses stored light or dark when set', () => {
    expect(resolveEffectiveTheme('light', true)).toBe('light');
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
  });

  it('falls back to system when preference is null', () => {
    expect(resolveEffectiveTheme(null, false)).toBe('light');
    expect(resolveEffectiveTheme(null, true)).toBe('dark');
  });
});
