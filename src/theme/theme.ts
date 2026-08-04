export const THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

export function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && (PREFERENCES as readonly string[]).includes(value);
}

export function readStoredPreference(): ThemePreference | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function getStoredOrDefaultPreference(): ThemePreference {
  return readStoredPreference() ?? 'system';
}

export function writeStoredPreference(preference: ThemePreference): void {
  localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export function getSystemTheme(
  media: Pick<MediaQueryList, 'matches'> = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : { matches: false },
): ResolvedTheme {
  return media.matches ? 'dark' : 'light';
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme = getSystemTheme(),
): ResolvedTheme {
  switch (preference) {
    case 'system':
      return systemTheme;
    case 'light':
    case 'dark':
      return preference;
    default: {
      const _exhaustive: never = preference;
      return _exhaustive;
    }
  }
}

export function nextExplicitTheme(resolved: ResolvedTheme): Exclude<ThemePreference, 'system'> {
  switch (resolved) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'light';
    default: {
      const _exhaustive: never = resolved;
      return _exhaustive;
    }
  }
}

export function applyResolvedTheme(resolved: ResolvedTheme): void {
  document.documentElement.setAttribute('data-theme', resolved);
}

export function applyThemePreference(
  preference: ThemePreference,
  systemTheme?: ResolvedTheme,
): ResolvedTheme {
  const resolved = resolveTheme(preference, systemTheme);
  applyResolvedTheme(resolved);
  return resolved;
}
