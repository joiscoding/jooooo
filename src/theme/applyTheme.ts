import type { ResolvedTheme, ThemePreference } from './types';

export function applyThemeToDocument(
  resolvedTheme: ResolvedTheme,
  preference: ThemePreference,
) {
  const root = document.documentElement;
  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
}
