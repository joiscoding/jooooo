import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { LOOKBOOK_THEME_STORAGE_KEY } from './constants';
import {
  type ThemePreference,
  applyThemeClassToRoot,
  readStoredPreference,
  resolveEffectiveTheme,
} from './themePreference';

type ThemeContextValue = {
  preference: ThemePreference;
  effectiveTheme: 'light' | 'dark';
  setPreference: (p: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function persistPreference(next: ThemePreference): void {
  try {
    localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, next);
  } catch {
    /* ignore quota / private mode */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(localStorage)
  );

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    getSystemPrefersDark
  );

  const effectiveTheme = resolveEffectiveTheme(preference, systemPrefersDark);

  const commitPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    persistPreference(next);
    const prefersDark = getSystemPrefersDark();
    applyThemeClassToRoot(
      document.documentElement,
      resolveEffectiveTheme(next, prefersDark)
    );
  }, []);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      commitPreference(next);
    },
    [commitPreference]
  );

  const cyclePreference = useCallback(() => {
    setPreferenceState((prev) => {
      const next: ThemePreference =
        prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system';
      persistPreference(next);
      const prefersDark = getSystemPrefersDark();
      applyThemeClassToRoot(
        document.documentElement,
        resolveEffectiveTheme(next, prefersDark)
      );
      return next;
    });
  }, []);

  useEffect(() => {
    applyThemeClassToRoot(document.documentElement, effectiveTheme);
  }, [effectiveTheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemPrefersDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      effectiveTheme,
      setPreference,
      cyclePreference,
    }),
    [preference, effectiveTheme, setPreference, cyclePreference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
