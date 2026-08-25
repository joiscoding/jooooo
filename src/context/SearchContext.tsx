import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { isSearchFocusShortcut } from '../utils/searchShortcut';

interface SearchContextValue {
  query: string;
  setQuery: (value: string) => void;
  registerSearchInput: (input: HTMLInputElement | null) => void;
  focusSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const registerSearchInput = useCallback((input: HTMLInputElement | null) => {
    searchInputRef.current = input;
  }, []);

  const focusSearch = useCallback(() => {
    const input = searchInputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSearchFocusShortcut(event)) return;

      event.preventDefault();
      focusSearch();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearch]);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      registerSearchInput,
      focusSearch,
    }),
    [query, registerSearchInput, focusSearch],
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
