import type { ThemePreference } from './types';

export function parseStoredPreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): 'light' | 'dark' {
  switch (preference) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'system':
      return prefersDark ? 'dark' : 'light';
    default: {
      const _exhaustive: never = preference;
      return _exhaustive;
    }
  }
}
