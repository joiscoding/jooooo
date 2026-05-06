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
import { readStoredThemePreference } from './readStoredThemePreference';
import { resolveEffectiveScheme } from './resolveEffectiveScheme';
import type { EffectiveScheme, ThemePreference } from './types';

type ThemeContextValue = {
  preference: ThemePreference;
  effectiveScheme: EffectiveScheme;
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemIsDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredThemePreference()
  );
  const [systemIsDark, setSystemIsDark] = useState(getSystemIsDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemIsDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const effectiveScheme = useMemo(
    () => resolveEffectiveScheme(preference, systemIsDark),
    [preference, systemIsDark]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-scheme', effectiveScheme);
  }, [effectiveScheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      localStorage.setItem(LOOKBOOK_THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ preference, effectiveScheme, setPreference }),
    [preference, effectiveScheme, setPreference]
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
