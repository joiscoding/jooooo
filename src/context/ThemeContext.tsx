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
  readStoredPreference,
  resolveEffectiveTheme,
  writeStoredPreference,
  type StoredThemePreference,
} from '../lib/themePreference';

type EffectiveTheme = 'light' | 'dark';

type ThemeContextValue = {
  effectiveTheme: EffectiveTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyDomTheme(effective: EffectiveTheme): void {
  document.documentElement.dataset.theme = effective;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<StoredThemePreference>(() =>
    typeof window === 'undefined' ? null : readStoredPreference(),
  );
  const [systemDark, setSystemDark] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  const effectiveTheme = useMemo(
    () => resolveEffectiveTheme(preference, systemDark),
    [preference, systemDark],
  );

  useEffect(() => {
    applyDomTheme(effectiveTheme);
  }, [effectiveTheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemDark(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: 'light' | 'dark' =
      effectiveTheme === 'light' ? 'dark' : 'light';
    writeStoredPreference(next);
    setPreference(next);
  }, [effectiveTheme]);

  const value = useMemo(
    () => ({ effectiveTheme, toggleTheme }),
    [effectiveTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('ThemeProvider required');
  return ctx;
}
