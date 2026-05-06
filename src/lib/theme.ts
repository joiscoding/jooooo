export const THEME_STORAGE_KEY = 'lookbook-theme';

/** Dispatched on the window after same-tab preference writes (storage events are cross-tab only). */
export const THEME_PREFERENCE_CHANGED_EVENT = 'lookbook-theme-preference';

export type ThemePreference = 'system' | 'light' | 'dark';

export function parseStoredPreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

export function resolveColorScheme(
  preference: ThemePreference,
  prefersDark: boolean
): 'light' | 'dark' {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return prefersDark ? 'dark' : 'light';
}

export function readStoredPreference(storage: Storage): ThemePreference {
  try {
    return parseStoredPreference(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function writeStoredPreference(
  storage: Storage,
  preference: ThemePreference
): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* quota or private mode */
  }
}

export function applyColorSchemeToDocument(
  doc: Document,
  scheme: 'light' | 'dark'
): void {
  doc.documentElement.setAttribute('data-color-scheme', scheme);
}
