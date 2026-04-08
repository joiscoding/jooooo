export type StyleTag =
  | 'minimal'
  | 'streetwear'
  | 'classic'
  | 'athleisure'
  | 'workwear';

export interface StoryBeat {
  heading: string;
  text: string;
}

export interface MerchandisingItem {
  category: string;
  label: string;
  note: string;
}

export interface Look {
  id: string;
  title: string;
  subtitle: string;
  tag: StyleTag;
  season: string;
  occasion: string;
  setting: string;
  featuredQuote: string;
  keyItems: string[];
  palette: string[];
  hero: string;
  gallery: string[];
  story: StoryBeat[];
  merchandising: MerchandisingItem[];
  collectionSlug: string;
  sortOrder: number;
}

export interface EditorialCollection {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  tag: StyleTag;
  coverLookId: string;
  lookIds: string[];
  tone: string;
}

export interface Catalog {
  looks: Look[];
  collections: EditorialCollection[];
  featuredLookId: string;
  seasonLabel: string;
  marketNote: string;
}

export interface Album {
  id: string;
  name: string;
  lookIds: string[];
  createdAt: number;
}

export const STYLE_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal / quiet',
  streetwear: 'Streetwear / urban',
  classic: 'Classic / tailored',
  athleisure: 'Athleisure / sporty',
  workwear: 'Workwear / heritage',
};

export const STYLE_ORDER: StyleTag[] = [
  'minimal',
  'streetwear',
  'classic',
  'athleisure',
  'workwear',
];
