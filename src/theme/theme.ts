export const LOOKBOOK_THEME_STORAGE_KEY = 'lookbook-theme';

export type ThemePreference = 'system' | 'light' | 'dark';

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** Read persisted preference; returns null if unset or invalid. */
export function readStoredPreference(storage: Storage): ThemePreference | null {
  try {
    const raw = storage.getItem(LOOKBOOK_THEME_STORAGE_KEY);
    if (isThemePreference(raw)) return raw;
  } catch {
    /* private / blocked storage */
  }
  return null;
}

export function writeStoredPreference(storage: Storage, preference: ThemePreference): void {
  try {
    storage.setItem(LOOKBOOK_THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  prefersDark: boolean
): 'light' | 'dark' {
  switch (preference) {
    case 'light':
      return 'light';
    case 'dark':
      return 'dark';
    case 'system':
      return prefersDark ? 'dark' : 'light';
    default: {
      const _exhaustive: never = preference;
      return _exhaustive;
    }
  }
}

export function applyDocumentTheme(effective: 'light' | 'dark', root: HTMLElement): void {
  root.dataset.theme = effective;
}
