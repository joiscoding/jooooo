export type StyleTag =
  | 'training'
  | 'recovery'
  | 'performance'
  | 'lifestyle'
  | 'competition';

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
  training: 'Training',
  recovery: 'Recovery',
  performance: 'Performance',
  lifestyle: 'Lifestyle',
  competition: 'Competition',
};

export const STYLE_ORDER: StyleTag[] = [
  'training',
  'recovery',
  'performance',
  'lifestyle',
  'competition',
];
