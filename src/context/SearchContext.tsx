import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

type SearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const value = useMemo(
    () => ({ query, setQuery, searchInputRef }),
    [query]
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
