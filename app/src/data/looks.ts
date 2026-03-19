export type StyleTag =
  | 'minimal'
  | 'streetwear'
  | 'classic'
  | 'athleisure'
  | 'workwear';

export interface Look {
  id: string;
  title: string;
  subtitle?: string;
  styleTag: StyleTag;
  season?: string;
  occasion?: string;
  keyItems?: string[];
  image: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

export const STYLE_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal / Quiet',
  streetwear: 'Streetwear / Urban',
  classic: 'Classic / Tailored',
  athleisure: 'Athleisure / Sporty',
  workwear: 'Workwear / Heritage',
};

export const STYLE_DESCRIPTIONS: Record<StyleTag, string> = {
  minimal: 'Neutrals, clean silhouettes, understated elegance',
  streetwear: 'Sneakers, layers, graphic and utility cues',
  classic: 'Structure, prep, dress-casual refinement',
  athleisure: 'Performance-inspired, relaxed athletic',
  workwear: 'Durable fabrics, utilitarian vintage influence',
};

export const looks: Look[] = [
  {
    id: 'look-01',
    title: 'Quiet Layers',
    subtitle: 'Understated neutrals for the modern minimalist',
    styleTag: 'minimal',
    season: 'Autumn/Winter',
    occasion: 'Everyday',
    keyItems: ['Wool overcoat', 'Cashmere knit', 'Wide trousers'],
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-02',
    title: 'Urban Edge',
    subtitle: 'City-ready streetwear with layered attitude',
    styleTag: 'streetwear',
    season: 'Spring/Summer',
    occasion: 'Casual',
    keyItems: ['Oversized hoodie', 'Cargo pants', 'High-top sneakers'],
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-03',
    title: 'Tailored Ease',
    subtitle: 'Refined structure meets relaxed confidence',
    styleTag: 'classic',
    season: 'All Season',
    occasion: 'Smart Casual',
    keyItems: ['Navy blazer', 'Oxford shirt', 'Chinos'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    aspectRatio: 'landscape',
  },
  {
    id: 'look-04',
    title: 'Movement',
    subtitle: 'Athletic comfort with urban polish',
    styleTag: 'athleisure',
    season: 'Spring/Summer',
    occasion: 'Active / Casual',
    keyItems: ['Performance tee', 'Joggers', 'Running shoes'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    aspectRatio: 'square',
  },
  {
    id: 'look-05',
    title: 'Workshop',
    subtitle: 'Utility-inspired heritage with modern sensibility',
    styleTag: 'workwear',
    season: 'Autumn/Winter',
    occasion: 'Weekend',
    keyItems: ['Chore jacket', 'Selvedge denim', 'Leather boots'],
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-06',
    title: 'Monochrome Study',
    subtitle: 'Tonal dressing in shades of stone',
    styleTag: 'minimal',
    season: 'All Season',
    occasion: 'Everyday',
    keyItems: ['Relaxed shirt', 'Pleated trousers', 'Suede loafers'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-07',
    title: 'Night Shift',
    subtitle: 'Dark tones with bold proportions',
    styleTag: 'streetwear',
    season: 'Autumn/Winter',
    occasion: 'Evening',
    keyItems: ['Bomber jacket', 'Graphic tee', 'Black denim'],
    image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=800&q=80',
    aspectRatio: 'landscape',
  },
  {
    id: 'look-08',
    title: 'Boardroom to Bar',
    subtitle: 'Versatile tailoring that transitions effortlessly',
    styleTag: 'classic',
    season: 'All Season',
    occasion: 'Business Casual',
    keyItems: ['Unstructured suit', 'Roll-neck knit', 'Monk-strap shoes'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-09',
    title: 'Trail Ready',
    subtitle: 'Technical performance meets outdoor style',
    styleTag: 'athleisure',
    season: 'Spring/Summer',
    occasion: 'Outdoor',
    keyItems: ['Windbreaker', 'Technical shorts', 'Trail runners'],
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80',
    aspectRatio: 'square',
  },
  {
    id: 'look-10',
    title: 'Foundry',
    subtitle: 'Raw, honest textures and rugged silhouettes',
    styleTag: 'workwear',
    season: 'Autumn/Winter',
    occasion: 'Weekend',
    keyItems: ['Canvas jacket', 'Flannel shirt', 'Work boots'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-11',
    title: 'Still Life',
    subtitle: 'Muted palette, considered proportions',
    styleTag: 'minimal',
    season: 'Spring/Summer',
    occasion: 'Everyday',
    keyItems: ['Linen blazer', 'Wide-leg trousers', 'Espadrilles'],
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-12',
    title: 'Drop Culture',
    subtitle: 'Statement pieces with streetwise proportions',
    styleTag: 'streetwear',
    season: 'All Season',
    occasion: 'Casual',
    keyItems: ['Puffer vest', 'Wide cargo trousers', 'Platform sneakers'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-13',
    title: 'Old Money',
    subtitle: 'Timeless elegance drawn from heritage codes',
    styleTag: 'classic',
    season: 'Autumn/Winter',
    occasion: 'Formal',
    keyItems: ['Camel topcoat', 'Cashmere scarf', 'Leather gloves'],
    image: 'https://images.unsplash.com/photo-1611601322175-ef8ec298c684?w=800&q=80',
    aspectRatio: 'landscape',
  },
  {
    id: 'look-14',
    title: 'Recovery Mode',
    subtitle: 'Post-workout comfort elevated',
    styleTag: 'athleisure',
    season: 'All Season',
    occasion: 'Casual',
    keyItems: ['Track jacket', 'French terry shorts', 'Slides'],
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80',
    aspectRatio: 'portrait',
  },
  {
    id: 'look-15',
    title: 'Iron Range',
    subtitle: 'Americana workwear with a modern cut',
    styleTag: 'workwear',
    season: 'Spring/Summer',
    occasion: 'Weekend',
    keyItems: ['Denim overshirt', 'Henley tee', 'Straight jeans'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
    aspectRatio: 'square',
  },
];
