export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'lookbook-theme';

export function parseThemePreference(raw: string | null): ThemePreference {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

export function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyResolvedTheme(resolved: 'light' | 'dark'): void {
  document.documentElement.dataset.theme = resolved;
}
