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

/** Short labels for HP-style category rails and product tiles. */
export const STYLE_SHORT_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal',
  streetwear: 'Streetwear',
  classic: 'Classic',
  athleisure: 'Athleisure',
  workwear: 'Workwear',
};

export const STYLE_ORDER: StyleTag[] = [
  'minimal',
  'streetwear',
  'classic',
  'athleisure',
  'workwear',
];
