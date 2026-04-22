export const THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

const VALID: readonly ThemePreference[] = ['system', 'light', 'dark'];

function isThemePreference(v: string | null): v is ThemePreference {
  return v !== null && (VALID as readonly string[]).includes(v);
}

export function parseStoredTheme(raw: string | null): ThemePreference {
  if (isThemePreference(raw)) return raw;
  return 'system';
}

export function getResolvedColorScheme(
  preference: ThemePreference,
  prefersDark: boolean,
): 'light' | 'dark' {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return prefersDark ? 'dark' : 'light';
}

export function readStoredTheme(): ThemePreference {
  if (typeof window === 'undefined' || !window.localStorage) return 'system';
  try {
    return parseStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function writeStoredTheme(preference: ThemePreference): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* quota / private mode */
  }
}

export function applyColorSchemeToDocument(
  scheme: 'light' | 'dark',
): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.colorScheme = scheme;
  document.documentElement.style.colorScheme = scheme;
}
