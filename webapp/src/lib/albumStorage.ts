import type { Album } from '../types'

const storageKey = 'quiet-fold-studio.albums.v1'

function isAlbum(value: unknown): value is Album {
  if (!value || typeof value !== 'object') {
    return false
  }

  const album = value as Record<string, unknown>

  return (
    typeof album.id === 'string' &&
    typeof album.name === 'string' &&
    typeof album.note === 'string' &&
    Array.isArray(album.lookIds) &&
    album.lookIds.every((entry) => typeof entry === 'string') &&
    Array.isArray(album.links) &&
    album.links.every(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        typeof (entry as Record<string, unknown>).id === 'string' &&
        typeof (entry as Record<string, unknown>).label === 'string' &&
        typeof (entry as Record<string, unknown>).url === 'string',
    ) &&
    typeof album.createdAt === 'string' &&
    typeof album.updatedAt === 'string'
  )
}

export function loadAlbums(): Album[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(storageKey)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isAlbum)
  } catch (error) {
    console.warn('Unable to read albums from localStorage.', error)
    return []
  }
}

export function saveAlbums(albums: Album[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(albums))
}
