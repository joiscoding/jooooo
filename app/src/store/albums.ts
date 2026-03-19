const STORAGE_KEY = 'lookbook-albums';

export interface Album {
  id: string;
  name: string;
  createdAt: number;
  lookIds: string[];
}

function generateId(): string {
  return `album-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function load(): Album[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(albums: Album[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
}

export function getAlbums(): Album[] {
  return load();
}

export function getAlbum(id: string): Album | undefined {
  return load().find((a) => a.id === id);
}

export function createAlbum(name: string): Album {
  const albums = load();
  const album: Album = {
    id: generateId(),
    name: name.trim(),
    createdAt: Date.now(),
    lookIds: [],
  };
  albums.push(album);
  save(albums);
  return album;
}

export function addLookToAlbum(albumId: string, lookId: string): void {
  const albums = load();
  const album = albums.find((a) => a.id === albumId);
  if (album && !album.lookIds.includes(lookId)) {
    album.lookIds.push(lookId);
    save(albums);
  }
}

export function removeLookFromAlbum(albumId: string, lookId: string): void {
  const albums = load();
  const album = albums.find((a) => a.id === albumId);
  if (album) {
    album.lookIds = album.lookIds.filter((id) => id !== lookId);
    save(albums);
  }
}

export function deleteAlbum(albumId: string): void {
  const albums = load().filter((a) => a.id !== albumId);
  save(albums);
}

export function addLinkToAlbum(albumId: string, link: string): void {
  const LINKS_KEY = `${STORAGE_KEY}-links`;
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    const allLinks: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    if (!allLinks[albumId]) allLinks[albumId] = [];
    if (!allLinks[albumId].includes(link)) {
      allLinks[albumId].push(link);
    }
    localStorage.setItem(LINKS_KEY, JSON.stringify(allLinks));
  } catch {
    /* noop */
  }
}

export function removeLinkFromAlbum(albumId: string, link: string): void {
  const LINKS_KEY = `${STORAGE_KEY}-links`;
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    const allLinks: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    if (allLinks[albumId]) {
      allLinks[albumId] = allLinks[albumId].filter((l) => l !== link);
      localStorage.setItem(LINKS_KEY, JSON.stringify(allLinks));
    }
  } catch {
    /* noop */
  }
}

export function getAlbumLinks(albumId: string): string[] {
  const LINKS_KEY = `${STORAGE_KEY}-links`;
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    const allLinks: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return allLinks[albumId] || [];
  } catch {
    return [];
  }
}
