import { useCallback, useEffect, useState } from 'react';
import type { Album } from '../types';

const KEY = 'lookbook_albums_v1';

function isAlbum(value: unknown): value is Album {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Album>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.lookIds) &&
    candidate.lookIds.every((lookId) => typeof lookId === 'string')
  );
}

function load(): Album[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every(isAlbum) ? parsed : [];
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
    const album: Album = { id, name: name.trim() || 'Untitled', lookIds: [] };
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
