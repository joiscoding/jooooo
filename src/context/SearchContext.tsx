import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { isSearchFocusShortcut } from '../lib/searchShortcut';

type SearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  focusSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const focusSearch = useCallback(() => {
    const input = searchInputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    input.select();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSearchFocusShortcut(event)) {
        return;
      }
      event.preventDefault();
      focusSearch();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [focusSearch]);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      focusSearch,
      searchInputRef,
    }),
    [query, focusSearch],
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
