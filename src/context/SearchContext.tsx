import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  getSearchShortcutHint,
  isEditableShortcutTarget,
  isGlobalSearchFocusShortcut,
} from '../utils/globalSearchShortcut';

type SearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  shortcutHint: string;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shortcutHint = useMemo(() => getSearchShortcutHint(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isGlobalSearchFocusShortcut(event)) return;
      if (isEditableShortcutTarget(event.target, searchInputRef.current))
        return;
      event.preventDefault();
      const el = searchInputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      el.select();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      searchInputRef,
      shortcutHint,
    }),
    [query, shortcutHint],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('SearchProvider is required');
  return ctx;
}

export function useSearchOptional(): SearchContextValue | null {
  return useContext(SearchContext);
}
