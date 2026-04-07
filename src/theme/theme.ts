export const THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export type EffectiveTheme = 'light' | 'dark';

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function readStoredPreference(storage: Storage): ThemePreference {
  try {
    const raw = storage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(raw)) return raw;
  } catch {
    /* private mode / blocked storage */
  }
  return 'system';
}

export function writeStoredPreference(
  storage: Storage,
  preference: ThemePreference
): void {
  try {
    if (preference === 'system') {
      storage.removeItem(THEME_STORAGE_KEY);
    } else {
      storage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    /* ignore */
  }
}

export function getSystemIsDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemIsDark: boolean
): EffectiveTheme {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  return systemIsDark ? 'dark' : 'light';
}

export function applyEffectiveThemeToDocument(
  doc: Document,
  effective: EffectiveTheme
): void {
  doc.documentElement.dataset.theme = effective;
  doc.documentElement.style.colorScheme = effective;
}
