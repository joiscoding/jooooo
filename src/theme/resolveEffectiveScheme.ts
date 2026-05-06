import type { EffectiveScheme, ThemePreference } from './types';

export function resolveEffectiveScheme(
  preference: ThemePreference,
  systemIsDark: boolean
): EffectiveScheme {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  return systemIsDark ? 'dark' : 'light';
}
