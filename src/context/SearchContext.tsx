import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { RefObject } from 'react';
import { isEditableEventTarget, isSearchFocusShortcut } from '../utils/searchShortcut';

export const GLOBAL_SEARCH_INPUT_ID = 'global-lookbook-search';

type SearchContextValue = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchInputId: string;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isSearchFocusShortcut(e)) {
        return;
      }
      if (isEditableEventTarget(e.target, GLOBAL_SEARCH_INPUT_ID)) {
        return;
      }
      e.preventDefault();
      const el = searchInputRef.current;
      if (el) {
        el.focus();
        el.select();
      }
    };
    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true });
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({
      searchQuery,
      setSearchQuery,
      searchInputRef,
      searchInputId: GLOBAL_SEARCH_INPUT_ID,
    }),
    [searchQuery]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
}
