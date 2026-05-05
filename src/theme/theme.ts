export const LOOKBOOK_THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export type ResolvedTheme = 'light' | 'dark';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** Reads stored preference; invalid or missing values default to system. */
export function parseStoredPreference(raw: string | null): ThemePreference {
  if (raw === null || raw === '') return 'system';
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isThemePreference(parsed)) return parsed;
  } catch {
    if (isThemePreference(raw)) return raw;
  }
  return 'system';
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return prefersDark ? 'dark' : 'light';
}

export function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    return parseStoredPreference(
      window.localStorage.getItem(LOOKBOOK_THEME_STORAGE_KEY),
    );
  } catch {
    return 'system';
  }
}

export function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme =
    resolved === 'dark' ? 'dark' : 'light';
}

/** Used by inline bootstrap in index.html — must stay in sync with parseStoredPreference. */
export function bootstrapThemeFromStorage(): ResolvedTheme {
  const pref = readStoredPreference();
  const prefersDark = getSystemPrefersDark();
  const resolved = resolveEffectiveTheme(pref, prefersDark);
  applyThemeToDocument(resolved);
  return resolved;
}
