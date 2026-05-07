import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

export type GallerySearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  focusSearchInput: () => void;
  searchInputRef: RefObject<HTMLInputElement>;
};

const GallerySearchContext = createContext<GallerySearchContextValue | null>(null);

export function GallerySearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = useCallback(() => {
    const el = searchInputRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.select();
  }, []);

  const value = useMemo<GallerySearchContextValue>(
    () => ({
      query,
      setQuery,
      focusSearchInput,
      searchInputRef,
    }),
    [query, focusSearchInput],
  );

  return <GallerySearchContext.Provider value={value}>{children}</GallerySearchContext.Provider>;
}

export function useGallerySearch(): GallerySearchContextValue {
  const ctx = useContext(GallerySearchContext);
  if (!ctx) {
    throw new Error('useGallerySearch must be used within GallerySearchProvider');
  }
  return ctx;
}
