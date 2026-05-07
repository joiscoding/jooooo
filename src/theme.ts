export const THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export function parseStoredPreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  return 'system';
}

export function readStoredPreference(): ThemePreference {
  if (typeof localStorage === 'undefined') return 'system';
  try {
    return parseStoredPreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function writeStoredPreference(pref: ThemePreference): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Private mode / quota — ignore
  }
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): 'light' | 'dark' {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return prefersDark ? 'dark' : 'light';
}

export function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
