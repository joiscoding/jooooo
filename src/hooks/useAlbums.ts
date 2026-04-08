import { useCallback, useEffect, useState } from 'react';
import type { Album } from '../types';

const KEY = 'lookbook_albums_v1';

function normalizeAlbum(value: unknown, index: number): Album | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const maybeAlbum = value as Partial<Album> & { lookIds?: unknown };
  const id = typeof maybeAlbum.id === 'string' ? maybeAlbum.id : '';
  const name = typeof maybeAlbum.name === 'string' ? maybeAlbum.name.trim() : '';
  const lookIds = Array.isArray(maybeAlbum.lookIds)
    ? maybeAlbum.lookIds.filter((lookId): lookId is string => typeof lookId === 'string')
    : [];

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    lookIds,
    createdAt:
      typeof maybeAlbum.createdAt === 'number'
        ? maybeAlbum.createdAt
        : Date.now() - index * 1_000,
  };
}

function load(): Album[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((album, index) => normalizeAlbum(album, index))
      .filter((album): album is Album => album !== null);
  } catch {
    return [];
  }
}

function save(albums: Album[]) {
  localStorage.setItem(KEY, JSON.stringify(albums));
}

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>(load);

  useEffect(() => {
    save(albums);
  }, [albums]);

  const createAlbum = useCallback((name: string) => {
    const id = `album-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const album: Album = {
      id,
      name: name.trim() || 'Untitled',
      lookIds: [],
      createdAt: Date.now(),
    };
    setAlbums((a) => [...a, album]);
    return album;
  }, []);

  const addLookToAlbum = useCallback((albumId: string, lookId: string) => {
    setAlbums((prev) =>
      prev.map((al) =>
        al.id === albumId && !al.lookIds.includes(lookId)
          ? { ...al, lookIds: [...al.lookIds, lookId] }
          : al
      )
    );
  }, []);

  const removeLookFromAlbum = useCallback((albumId: string, lookId: string) => {
    setAlbums((prev) =>
      prev.map((al) =>
        al.id === albumId
          ? { ...al, lookIds: al.lookIds.filter((id) => id !== lookId) }
          : al
      )
    );
  }, []);

  const deleteAlbum = useCallback((albumId: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }, []);

  return {
    albums,
    createAlbum,
    addLookToAlbum,
    removeLookFromAlbum,
    deleteAlbum,
  };
}
