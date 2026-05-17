import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  applyColorSchemeToDocument,
  readThemePreferenceFromStorage,
  resolveEffectiveColorScheme,
  writeThemePreferenceToStorage,
  type ThemePreference,
} from '../theme/themePreference';

type ThemeContextValue = {
  preference: ThemePreference;
  effectiveScheme: 'light' | 'dark';
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readThemePreferenceFromStorage(),
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => getSystemPrefersDark(),
  );

  const effectiveScheme = useMemo(
    () => resolveEffectiveColorScheme(preference, systemPrefersDark),
    [preference, systemPrefersDark],
  );

  useEffect(() => {
    applyColorSchemeToDocument(effectiveScheme);
  }, [effectiveScheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemPrefersDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeThemePreferenceToStorage(next);
    const prefersDark = getSystemPrefersDark();
    setSystemPrefersDark(prefersDark);
    applyColorSchemeToDocument(
      resolveEffectiveColorScheme(next, prefersDark),
    );
  }, []);

  const value = useMemo(
    () => ({ preference, effectiveScheme, setPreference }),
    [preference, effectiveScheme, setPreference],
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
