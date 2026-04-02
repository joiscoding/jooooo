export const THEME_STORAGE_KEY = 'lookbook-theme';

export type StoredThemePreference = 'light' | 'dark' | null;

export function readStoredPreference(): StoredThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    /* private mode or blocked storage */
  }
  return null;
}

export function writeStoredPreference(pref: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
}

export function resolveEffectiveTheme(
  preference: StoredThemePreference,
  systemPrefersDark: boolean,
): 'light' | 'dark' {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemPrefersDark ? 'dark' : 'light';
}
