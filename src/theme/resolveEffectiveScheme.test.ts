import { describe, expect, it } from 'vitest';
import { resolveEffectiveScheme } from './resolveEffectiveScheme';

describe('resolveEffectiveScheme', () => {
  it('uses explicit light', () => {
    expect(resolveEffectiveScheme('light', true)).toBe('light');
    expect(resolveEffectiveScheme('light', false)).toBe('light');
  });

  it('uses explicit dark', () => {
    expect(resolveEffectiveScheme('dark', true)).toBe('dark');
    expect(resolveEffectiveScheme('dark', false)).toBe('dark');
  });

  it('follows system when preference is system', () => {
    expect(resolveEffectiveScheme('system', false)).toBe('light');
    expect(resolveEffectiveScheme('system', true)).toBe('dark');
  });
});
