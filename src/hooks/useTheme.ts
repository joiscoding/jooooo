import { useCallback, useEffect, useState } from 'react';
import {
  type ThemePreference,
  applyColorSchemeToDocument,
  getResolvedColorScheme,
  readStoredTheme,
  writeStoredTheme,
} from '../theme';

function getDarkModeQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function getPrefersDark(): boolean {
  return getDarkModeQuery()?.matches ?? false;
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof document !== 'undefined') {
      const fromDom = document.documentElement.dataset
        .themePreference as string | undefined;
      if (fromDom === 'system' || fromDom === 'light' || fromDom === 'dark') {
        return fromDom;
      }
    }
    return readStoredTheme();
  });
  const [prefersDark, setPrefersDark] = useState(getPrefersDark);

  const apply = useCallback((pref: ThemePreference) => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.themePreference = pref;
    const scheme = getResolvedColorScheme(pref, getPrefersDark());
    applyColorSchemeToDocument(scheme);
  }, []);

  const setAndPersist = useCallback(
    (next: ThemePreference) => {
      setPreference(next);
      writeStoredTheme(next);
      apply(next);
    },
    [apply],
  );

  useEffect(() => {
    apply(preference);
  }, [apply, preference]);

  useEffect(() => {
    const mql = getDarkModeQuery();
    if (!mql) return;
    const onChange = () => {
      setPrefersDark(mql.matches);
      if (readStoredTheme() === 'system') {
        const scheme = getResolvedColorScheme('system', mql.matches);
        applyColorSchemeToDocument(scheme);
      }
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (preference === 'system') {
      const scheme = getResolvedColorScheme('system', prefersDark);
      applyColorSchemeToDocument(scheme);
    }
  }, [preference, prefersDark]);

  return { preference, setTheme: setAndPersist };
}
