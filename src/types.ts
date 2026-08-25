export type StyleTag =
  | 'minimal'
  | 'streetwear'
  | 'classic'
  | 'athleisure'
  | 'workwear';

export interface Look {
  id: string;
  title: string;
  tag: StyleTag;
  season: string;
  occasion: string;
  keyItems: string[];
  hero: string;
  gallery: string[];
  /** Mock retail metadata for the bundle price of the whole outfit. Demo only. */
  priceUsd?: number;
  wasPriceUsd?: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
}

export interface Album {
  id: string;
  name: string;
  lookIds: string[];
}

export const STYLE_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal / quiet',
  streetwear: 'Streetwear / urban',
  classic: 'Classic / tailored',
  athleisure: 'Athleisure / sporty',
  workwear: 'Workwear / heritage',
};

export function isStyleTag(value: string | null): value is StyleTag {
  return value !== null && value in STYLE_LABELS;
}

export const STYLE_ORDER: StyleTag[] = [
  'minimal',
  'streetwear',
  'classic',
  'athleisure',
  'workwear',
];
