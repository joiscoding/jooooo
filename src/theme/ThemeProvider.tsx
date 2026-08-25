import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyThemePreference,
  getStoredOrDefaultPreference,
  getSystemTheme,
  getToggledPreference,
  readStoredPreference,
  resolveTheme,
  writeStoredPreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    getStoredOrDefaultPreference(),
  );
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(getStoredOrDefaultPreference()),
  );

  const setPreference = useCallback((next: ThemePreference) => {
    writeStoredPreference(next);
    setPreferenceState(next);
    setResolved(applyThemePreference(next));
  }, []);

  const toggleTheme = useCallback(() => {
    setResolved((currentResolved) => {
      const next = getToggledPreference(currentResolved);
      writeStoredPreference(next);
      setPreferenceState(next);
      return applyThemePreference(next);
    });
  }, []);

  useEffect(() => {
    const stored = readStoredPreference();
    const initial = stored ?? 'system';
    setPreferenceState(initial);
    setResolved(applyThemePreference(initial));
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (preference !== 'system') return;
      setResolved(applyThemePreference('system', getSystemTheme(media)));
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, toggleTheme }),
    [preference, resolved, setPreference, toggleTheme],
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
