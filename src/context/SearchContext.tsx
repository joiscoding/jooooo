import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const GLOBAL_SEARCH_INPUT_ID = 'global-search-input';

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  focusSearch: () => void;
  globalSearchInputId: typeof GLOBAL_SEARCH_INPUT_ID;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusSearch = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.select();
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      inputRef,
      focusSearch,
      globalSearchInputId: GLOBAL_SEARCH_INPUT_ID,
    }),
    [query, focusSearch],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return ctx;
}

export { GLOBAL_SEARCH_INPUT_ID };
