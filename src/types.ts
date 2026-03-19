export const STYLE_TAGS = [
  'minimal',
  'streetwear',
  'classic',
  'athleisure',
  'workwear',
] as const;

export type StyleTag = (typeof STYLE_TAGS)[number];

export interface Look {
  id: string;
  title: string;
  primaryTag: StyleTag;
  heroImage: string;
  images?: string[];
  season?: string;
  occasion?: string;
  keyItems?: string[];
}

export interface AlbumLink {
  id: string;
  title: string;
  url: string;
}

export interface Album {
  id: string;
  name: string;
  lookIds: string[];
  links: AlbumLink[];
}

export const STORAGE_KEY = 'atelier-albums-v1';
