import { createContext, createElement, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAlbums } from '../hooks/useAlbums';
import type { Album } from '../types';

type Ctx = ReturnType<typeof useAlbums>;

const AlbumsContext = createContext<Ctx | null>(null);

export function AlbumsProvider({ children }: { children: ReactNode }) {
  const value = useAlbums();
  return createElement(AlbumsContext.Provider, { value }, children);
}

export function useAlbumsContext(): Ctx {
  const ctx = useContext(AlbumsContext);
  if (!ctx) throw new Error('AlbumsProvider required');
  return ctx;
}

export type { Album };
