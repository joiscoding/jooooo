import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import type { ThemePreference } from '../theme';
import {
  parseStoredPreference,
  readStoredPreference,
  THEME_STORAGE_KEY,
  writeStoredPreference,
  resolveEffectiveTheme,
} from '../theme';

type ThemeContextValue = {
  preference: ThemePreference;
  effectiveTheme: 'light' | 'dark';
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribeToSystemTheme(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getSystemPrefersDarkSnapshot(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    typeof window === 'undefined' ? 'system' : readStoredPreference(),
  );

  const prefersDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersDarkSnapshot,
    () => false,
  );

  const effectiveTheme = useMemo(
    () => resolveEffectiveTheme(preference, prefersDark),
    [preference, prefersDark],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
  }, [effectiveTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeStoredPreference(next);
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === THEME_STORAGE_KEY)
        setPreferenceState(parseStoredPreference(e.newValue));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({ preference, effectiveTheme, setPreference }),
    [preference, effectiveTheme, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
