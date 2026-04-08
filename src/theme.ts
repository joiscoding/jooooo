export const THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export function parseThemePreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

export function readStoredTheme(): ThemePreference {
  try {
    return parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function writeStoredTheme(pref: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // ignore quota / private mode
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Resolved appearance for UI that must know light vs dark (e.g. icons). */
export function resolveEffectiveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return systemPrefersDark() ? 'dark' : 'light';
}

export function applyDocumentTheme(pref: ThemePreference): void {
  document.documentElement.dataset.theme = pref;
}
