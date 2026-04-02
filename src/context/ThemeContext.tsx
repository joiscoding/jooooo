import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'studio-lookbook-theme';

export type Theme = 'light' | 'dark';

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return null;
}

function subscribeToSystem(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getSystemIsDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userChoice, setUserChoice] = useState<Theme | null>(() =>
    typeof window === 'undefined' ? null : readStored()
  );

  const systemIsDark = useSyncExternalStore(
    subscribeToSystem,
    getSystemIsDark,
    () => false
  );

  const theme: Theme =
    userChoice ?? (systemIsDark ? 'dark' : 'light');

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setUserChoice((prev) => {
      const current: Theme =
        prev ?? (getSystemIsDark() ? 'dark' : 'light');
      const next: Theme = current === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
