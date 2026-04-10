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
  registerSearchInputRef: (el: HTMLInputElement | null) => void;
  focusSearchInput: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const registerSearchInputRef = useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el;
  }, []);

  const focusSearchInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      registerSearchInputRef,
      focusSearchInput,
    }),
    [query, registerSearchInputRef, focusSearchInput],
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
