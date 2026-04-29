import { LOOKBOOK_THEME_STORAGE_KEY } from './constants';

export type ThemePreference = 'system' | 'light' | 'dark';

export function parseStoredPreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

export function readStoredPreference(storage: Storage): ThemePreference {
  try {
    return parseStoredPreference(storage.getItem(LOOKBOOK_THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  prefersDark: boolean
): 'light' | 'dark' {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return prefersDark ? 'dark' : 'light';
}

export function applyThemeClassToRoot(
  root: HTMLElement,
  effective: 'light' | 'dark'
): void {
  root.classList.toggle('dark', effective === 'dark');
  root.style.colorScheme = effective === 'dark' ? 'dark' : 'light';
}
