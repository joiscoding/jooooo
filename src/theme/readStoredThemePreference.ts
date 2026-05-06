import { LOOKBOOK_THEME_STORAGE_KEY } from './constants';
import type { ThemePreference } from './types';

export function readStoredThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(LOOKBOOK_THEME_STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
  } catch {
    /* storage unavailable */
  }
  return 'system';
}
