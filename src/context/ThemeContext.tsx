import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'lookbook-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (value: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }

  return 'system';
}

function resolveTheme(
  preference: ThemePreference,
  isSystemDark: boolean
): ResolvedTheme {
  if (preference === 'system') {
    return isSystemDark ? 'dark' : 'light';
  }
  return preference;
}

function getCurrentSystemDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(DARK_QUERY).matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(
    readStoredPreference
  );
  const [isSystemDark, setIsSystemDark] = useState(getCurrentSystemDark);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setIsSystemDark(event.matches);
    };

    // Keep system mode live when user switches OS appearance.
    setIsSystemDark(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const resolved = resolveTheme(preference, isSystemDark);
    document.documentElement.setAttribute('data-theme', resolved);
  }, [preference, isSystemDark]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      preference,
      resolvedTheme: resolveTheme(preference, isSystemDark),
      setPreference,
    };
  }, [isSystemDark, preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('ThemeProvider required');
  }
  return value;
}
