import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ResolvedTheme, ThemePreference } from '../theme/theme';
import {
  applyThemeToDocument,
  bootstrapThemeFromStorage,
  getSystemPrefersDark,
  readStoredPreference,
  resolveEffectiveTheme,
  LOOKBOOK_THEME_STORAGE_KEY,
} from '../theme/theme';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(),
  );
  const [systemDark, setSystemDark] = useState(() => getSystemPrefersDark());

  const resolvedTheme = useMemo(
    () => resolveEffectiveTheme(preference, systemDark),
    [preference, systemDark],
  );

  useEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemDark(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      if (next === 'system') {
        window.localStorage.removeItem(LOOKBOOK_THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          LOOKBOOK_THEME_STORAGE_KEY,
          JSON.stringify(next),
        );
      }
    } catch {
      /* ignore quota / private mode */
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      .matches;
    applyThemeToDocument(resolveEffectiveTheme(next, prefersDark));
  }, []);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
    }),
    [preference, resolvedTheme, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Ensures document theme matches storage when ThemeProvider mounts (redundant if inline script ran). */
export function syncThemeFromStorage(): void {
  bootstrapThemeFromStorage();
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
