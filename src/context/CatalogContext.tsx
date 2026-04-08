import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchCatalog } from '../data/fetchLooks';
import type { Catalog, EditorialCollection, Look } from '../types';

interface CatalogContextValue {
  catalog: Catalog | null;
  looks: Look[];
  collections: EditorialCollection[];
  featuredLook: Look | null;
  loading: boolean;
  getLook: (lookId: string) => Look | null;
  getCollection: (collectionSlug: string) => EditorialCollection | null;
  getLooksForCollection: (collectionSlug: string) => Look[];
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCatalog()
      .then((nextCatalog) => {
        if (!cancelled) {
          setCatalog(nextCatalog);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const looks = catalog?.looks ?? [];
    const collections = catalog?.collections ?? [];
    const featuredLook =
      looks.find((look) => look.id === catalog?.featuredLookId) ?? looks[0] ?? null;

    return {
      catalog,
      looks,
      collections,
      featuredLook,
      loading,
      getLook: (lookId: string) =>
        looks.find((look) => look.id === lookId) ?? null,
      getCollection: (collectionSlug: string) =>
        collections.find((collection) => collection.slug === collectionSlug) ?? null,
      getLooksForCollection: (collectionSlug: string) =>
        looks.filter((look) => look.collectionSlug === collectionSlug),
    };
  }, [catalog, loading]);

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalogContext(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('CatalogProvider required');
  }

  return context;
}
