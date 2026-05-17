export const LOOKBOOK_THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export function parseStoredThemePreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

export function resolveEffectiveColorScheme(
  preference: ThemePreference,
  prefersDark: boolean,
): 'light' | 'dark' {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return prefersDark ? 'dark' : 'light';
}

export function readThemePreferenceFromStorage(): ThemePreference {
  try {
    return parseStoredThemePreference(
      localStorage.getItem(LOOKBOOK_THEME_STORAGE_KEY),
    );
  } catch {
    return 'system';
  }
}

export function writeThemePreferenceToStorage(
  preference: ThemePreference,
): void {
  try {
    localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, preference);
  } catch {
    // Private mode or blocked storage — still apply session theme in memory.
  }
}

export function applyColorSchemeToDocument(scheme: 'light' | 'dark'): void {
  document.documentElement.dataset.colorScheme = scheme;
}
