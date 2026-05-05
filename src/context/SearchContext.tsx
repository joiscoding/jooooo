import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type SearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  /** Called by the header search mount to register how to focus the input. */
  registerFocusSearch: (focus: () => void) => () => void;
  focusSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const focusRef = useRef<(() => void) | null>(null);

  const registerFocusSearch = useCallback((focus: () => void) => {
    focusRef.current = focus;
    return () => {
      if (focusRef.current === focus) focusRef.current = null;
    };
  }, []);

  const focusSearch = useCallback(() => {
    focusRef.current?.();
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      registerFocusSearch,
      focusSearch,
    }),
    [query, registerFocusSearch, focusSearch],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
}
