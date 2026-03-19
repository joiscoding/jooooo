import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Album, AlbumLink } from '../types';
import { STORAGE_KEY } from '../types';

function safeParse(raw: string | null): Album[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (a): a is Album =>
          !!a &&
          typeof a === 'object' &&
          'id' in a &&
          'name' in a &&
          'lookIds' in a
      )
      .map((a) => ({
        id: String((a as Album).id),
        name: String((a as Album).name),
        lookIds: Array.isArray((a as Album).lookIds)
          ? (a as Album).lookIds.map(String)
          : [],
        links: Array.isArray((a as Album).links)
          ? (a as Album).links.filter(
              (l): l is AlbumLink =>
                !!l &&
                typeof l === 'object' &&
                'id' in l &&
                'title' in l &&
                'url' in l
            )
          : [],
      }));
  } catch {
    return [];
  }
}

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID?.() ?? String(Date.now())}`;
}

interface AlbumsContextValue {
  albums: Album[];
  createAlbum: (name: string) => Album;
  addLookToAlbum: (albumId: string, lookId: string) => void;
  removeLookFromAlbum: (albumId: string, lookId: string) => void;
  addLinkToAlbum: (albumId: string, title: string, url: string) => void;
  removeLinkFromAlbum: (albumId: string, linkId: string) => void;
  deleteAlbum: (albumId: string) => void;
}

const AlbumsContext = createContext<AlbumsContextValue | null>(null);

export function AlbumsProvider({ children }: { children: React.ReactNode }) {
  const [albums, setAlbums] = useState<Album[]>(() => {
    if (typeof window === 'undefined') return [];
    return safeParse(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
    } catch {
      /* ignore quota */
    }
  }, [albums]);

  const createAlbum = useCallback((name: string) => {
    const album: Album = {
      id: uid('album'),
      name: name.trim() || 'Untitled album',
      lookIds: [],
      links: [],
    };
    setAlbums((prev) => [...prev, album]);
    return album;
  }, []);

  const addLookToAlbum = useCallback((albumId: string, lookId: string) => {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId && !a.lookIds.includes(lookId)
          ? { ...a, lookIds: [...a.lookIds, lookId] }
          : a
      )
    );
  }, []);

  const removeLookFromAlbum = useCallback((albumId: string, lookId: string) => {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === albumId
          ? { ...a, lookIds: a.lookIds.filter((id) => id !== lookId) }
          : a
      )
    );
  }, []);

  const addLinkToAlbum = useCallback(
    (albumId: string, title: string, url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      let href = trimmed;
      if (!/^https?:\/\//i.test(href)) {
        href = `https://${href}`;
      }
      const link: AlbumLink = {
        id: uid('link'),
        title: title.trim() || href,
        url: href,
      };
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumId ? { ...a, links: [...a.links, link] } : a
        )
      );
    },
    []
  );

  const removeLinkFromAlbum = useCallback(
    (albumId: string, linkId: string) => {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumId
            ? { ...a, links: a.links.filter((l) => l.id !== linkId) }
            : a
        )
      );
    },
    []
  );

  const deleteAlbum = useCallback((albumId: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }, []);

  const value = useMemo(
    () => ({
      albums,
      createAlbum,
      addLookToAlbum,
      removeLookFromAlbum,
      addLinkToAlbum,
      removeLinkFromAlbum,
      deleteAlbum,
    }),
    [
      albums,
      createAlbum,
      addLookToAlbum,
      removeLookFromAlbum,
      addLinkToAlbum,
      removeLinkFromAlbum,
      deleteAlbum,
    ]
  );

  return (
    <AlbumsContext.Provider value={value}>{children}</AlbumsContext.Provider>
  );
}

export function useAlbums() {
  const ctx = useContext(AlbumsContext);
  if (!ctx) throw new Error('useAlbums must be used within AlbumsProvider');
  return ctx;
}
