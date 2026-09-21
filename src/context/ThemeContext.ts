import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { applyThemeToDocument } from '../theme/applyTheme';
import { THEME_STORAGE_KEY } from '../theme/constants';
import {
  parseStoredPreference,
  resolveEffectiveTheme,
} from '../theme/preference';
import type { ResolvedTheme, ThemePreference } from '../theme/types';

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }
  try {
    return parseStoredPreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

function readSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredPreference);
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    readSystemPrefersDark,
  );

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemPrefersDark(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const resolvedTheme = useMemo(
    () => resolveEffectiveTheme(theme, systemPrefersDark),
    [theme, systemPrefersDark],
  );

  useEffect(() => {
    applyThemeToDocument(resolvedTheme, theme);
  }, [resolvedTheme, theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode / quota */
    }
    const prefersDark =
      next === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : next === 'dark';
    applyThemeToDocument(resolveEffectiveTheme(next, prefersDark), next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return createElement(
    ThemeContext.Provider,
    { value },
    children,
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
