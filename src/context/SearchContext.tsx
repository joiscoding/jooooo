import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode, RefObject } from 'react';

type SearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  focusSearchInput: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  const focusSearchInput = useCallback(() => {
    const el = searchInputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      focusSearchInput,
      searchInputRef,
    }),
    [query, focusSearchInput],
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
