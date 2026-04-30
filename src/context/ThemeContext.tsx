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
  applyDocumentTheme,
  readStoredPreference,
  resolveEffectiveTheme,
  writeStoredPreference,
  type ThemePreference,
} from '../theme/theme';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
  effectiveTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    return readStoredPreference(window.localStorage) ?? 'system';
  });
  const [prefersDark, setPrefersDark] = useState(getPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setPrefersDark(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const effectiveTheme = useMemo(
    () => resolveEffectiveTheme(preference, prefersDark),
    [preference, prefersDark]
  );

  useEffect(() => {
    applyDocumentTheme(effectiveTheme, document.documentElement);
  }, [effectiveTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeStoredPreference(window.localStorage, next);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyDocumentTheme(resolveEffectiveTheme(next, systemDark), document.documentElement);
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference, effectiveTheme }),
    [preference, setPreference, effectiveTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
