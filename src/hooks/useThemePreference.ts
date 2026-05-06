import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  THEME_PREFERENCE_CHANGED_EVENT,
  THEME_STORAGE_KEY,
  type ThemePreference,
  applyColorSchemeToDocument,
  readStoredPreference,
  resolveColorScheme,
  writeStoredPreference,
} from '../lib/theme';

function getSystemDarkQuery(): MediaQueryList | null {
  if (typeof window === 'undefined') return null;
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function subscribeSystemPreference(onStoreChange: () => void): () => void {
  const mq = getSystemDarkQuery();
  if (!mq) return () => {};
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getSystemPrefersDarkSnapshot(): boolean {
  return getSystemDarkQuery()?.matches ?? false;
}

export function useThemePreference(): {
  preference: ThemePreference;
  resolvedScheme: 'light' | 'dark';
  setPreference: (next: ThemePreference) => void;
} {
  const prefersDark = useSyncExternalStore(
    subscribeSystemPreference,
    getSystemPrefersDarkSnapshot,
    () => false
  );

  const subscribeStorage = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY || e.key === null) onStoreChange();
    };
    const onLocalPreference = () => onStoreChange();
    window.addEventListener('storage', onStorage);
    window.addEventListener(THEME_PREFERENCE_CHANGED_EVENT, onLocalPreference);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(
        THEME_PREFERENCE_CHANGED_EVENT,
        onLocalPreference
      );
    };
  }, []);

  const getPreferenceSnapshot = useCallback((): ThemePreference => {
    if (typeof window === 'undefined') return 'system';
    return readStoredPreference(window.localStorage);
  }, []);

  const getPreferenceServer = useCallback((): ThemePreference => 'system', []);

  const preference = useSyncExternalStore(
    subscribeStorage,
    getPreferenceSnapshot,
    getPreferenceServer
  );

  const resolvedScheme = resolveColorScheme(preference, prefersDark);

  useEffect(() => {
    applyColorSchemeToDocument(document, resolvedScheme);
  }, [resolvedScheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    if (typeof window === 'undefined') return;
    writeStoredPreference(window.localStorage, next);
    window.dispatchEvent(new Event(THEME_PREFERENCE_CHANGED_EVENT));
  }, []);

  return { preference, resolvedScheme, setPreference };
}
