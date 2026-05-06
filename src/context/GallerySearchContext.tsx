import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode, RefObject } from 'react';

export type GallerySearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  focusGlobalSearch: () => void;
};

const GallerySearchContext = createContext<GallerySearchContextValue | null>(
  null,
);

export function GallerySearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusGlobalSearch = useCallback(() => {
    const el = searchInputRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const len = el.value.length;
    if (len > 0) {
      el.setSelectionRange(0, len);
    }
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      searchInputRef,
      focusGlobalSearch,
    }),
    [query, focusGlobalSearch],
  );

  return (
    <GallerySearchContext.Provider value={value}>
      {children}
    </GallerySearchContext.Provider>
  );
}

export function useGallerySearch(): GallerySearchContextValue {
  const ctx = useContext(GallerySearchContext);
  if (!ctx) {
    throw new Error('useGallerySearch must be used within GallerySearchProvider');
  }
  return ctx;
}
