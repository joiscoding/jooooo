import type {
  Catalog,
  EditorialCollection,
  Look,
  MerchandisingItem,
  StoryBeat,
  StyleTag,
} from '../types';
import seedLooks from './looks.json';

/** Bump when seed shape or merchandising strategy changes so stale overrides are ignored. */
const STORAGE_MCP_KEY = 'lookbook_mcp_looks_v14';
const DEFAULT_SEASON_LABEL = 'Autumn Journal 2026';
const DEFAULT_MARKET_NOTE =
  'Tailored city dressing, sporting layers, and warm-weather escapes edited into one calm menswear narrative.';
const DEFAULT_FEATURED_LOOK_ID = 'city-charcoal';

const COLLECTION_DEFINITIONS: Record<
  string,
  Omit<EditorialCollection, 'coverLookId' | 'lookIds'>
> = {
  townhouse-evening: {
    slug: 'townhouse-evening',
    eyebrow: 'Editorial chapter I',
    title: 'Townhouse Evening',
    description:
      'Soft tailoring, evening navy, and city-light textures shape a polished urban wardrobe.',
    tag: 'classic',
    tone: 'For dinner reservations, late meetings, and polished arrivals.',
  },
  sporting-club: {
    slug: 'sporting-club',
    eyebrow: 'Editorial chapter II',
    title: 'Sporting Club',
    description:
      'Athletic layers tuned for travel mornings, recovery hours, and weekends in motion.',
    tag: 'athleisure',
    tone: 'Performance ease balanced with quiet luxury finishes.',
  },
  estate-weekend: {
    slug: 'estate-weekend',
    eyebrow: 'Editorial chapter III',
    title: 'Estate Weekend',
    description:
      'Sun-washed neutrals, crisp shirting, and soft resort tailoring for slower days away.',
    tag: 'minimal',
    tone: 'Easy silhouettes for terraces, galleries, and long lunches.',
  },
  metropolitan-casual: {
    slug: 'metropolitan-casual',
    eyebrow: 'Editorial chapter IV',
    title: 'Metropolitan Casual',
    description:
      'Utility layers and downtown movement recast streetwear into a more elevated rhythm.',
    tag: 'streetwear',
    tone: 'City energy grounded by tailored proportions and restrained palettes.',
  },
  field-uniform: {
    slug: 'field-uniform',
    eyebrow: 'Editorial chapter V',
    title: 'Field Uniform',
    description:
      'Canvas, denim, and weather-ready boots deliver heritage workwear with a refined edge.',
    tag: 'workwear',
    tone: 'Built for wet pavements, open-air markets, and workshop hours.',
  },
};

interface EditorialLookOverride {
  subtitle?: string;
  setting?: string;
  featuredQuote?: string;
  palette?: string[];
  story?: StoryBeat[];
  merchandising?: MerchandisingItem[];
  collectionSlug?: string;
  sortOrder?: number;
}

const EDITORIAL_LOOK_OVERRIDES: Record<string, EditorialLookOverride> = {
  'city-charcoal': {
    subtitle: 'Charcoal tailoring for the kind of city calendar that begins at breakfast and ends after dark.',
    setting: 'Upper East Side townhouse',
    featuredQuote: 'Tailoring reads warmer when the structure is softened and the palette stays close to the pavement.',
    palette: ['Charcoal', 'Ink', 'Soft ivory'],
    story: [
      {
        heading: 'Arrival',
        text: 'A relaxed wool overshirt and pressed trouser keep the line sharp without drifting into formality.',
      },
      {
        heading: 'Texture',
        text: 'Fine-gauge knitwear underpins the look with quiet warmth, making the silhouette feel finished rather than layered.',
      },
    ],
    merchandising: [
      {
        category: 'Outer layer',
        label: 'Charcoal wool overshirt',
        note: 'Softly structured to sit between blazer and coat.',
      },
      {
        category: 'Knit',
        label: 'Fine-gauge mock-neck',
        note: 'A clean base that sharpens the neckline.',
      },
      {
        category: 'Trouser',
        label: 'Pressed city trouser',
        note: 'Fluid through the leg with enough weight to hold shape.',
      },
    ],
    collectionSlug: 'townhouse-evening',
    sortOrder: 1,
  },
  'boardroom-soft': {
    subtitle: 'A more relaxed office silhouette, cut to look composed from first coffee to final call.',
    setting: 'Private members lounge',
    featuredQuote: 'Soft tailoring works best when each piece looks lived in, not newly issued.',
    palette: ['Taupe', 'Chocolate', 'Porcelain'],
    story: [
      {
        heading: 'Tailored ease',
        text: 'An unstructured blazer keeps the shoulder calm and lets the shirt collar do the talking.',
      },
      {
        heading: 'Everyday polish',
        text: 'Oxford shirting and tapered chinos create an office uniform with less friction and more movement.',
      },
    ],
    merchandising: [
      {
        category: 'Jacket',
        label: 'Unstructured wool blazer',
        note: 'Minimal padding for a quiet drape.',
      },
      {
        category: 'Shirt',
        label: 'Crisp Oxford button-down',
        note: 'A foundational layer that reads smart in every light.',
      },
      {
        category: 'Trouser',
        label: 'Tapered chino trouser',
        note: 'Trim enough for the office, relaxed enough for dinner after.',
      },
    ],
    collectionSlug: 'townhouse-evening',
    sortOrder: 2,
  },
  'navy-precision': {
    subtitle: 'Dark navy, high collars, and formal ease for winter evenings with a dress code.',
    setting: 'Museum district',
    featuredQuote: 'Precision does not need to feel severe when the fabric has depth and the palette stays tonal.',
    palette: ['Midnight navy', 'Black coffee', 'Winter white'],
    story: [
      {
        heading: 'Evening line',
        text: 'The double-breasted overcoat frames the torso, while a slim turtleneck strips away unnecessary detail.',
      },
      {
        heading: 'Cold-weather finish',
        text: 'Wool trousers carry the tonal story downward, keeping the entire look grounded and sleek.',
      },
    ],
    merchandising: [
      {
        category: 'Coat',
        label: 'Double-breasted wool topcoat',
        note: 'Cut with presence but softened by a dark navy tone.',
      },
      {
        category: 'Base',
        label: 'Merino turtleneck',
        note: 'Replaces the shirt with a smoother, evening-ready layer.',
      },
      {
        category: 'Trouser',
        label: 'Dark wool trouser',
        note: 'A clean break over polished shoes or loafers.',
      },
    ],
    collectionSlug: 'townhouse-evening',
    sortOrder: 3,
  },
  'track-recovery': {
    subtitle: 'Travel-friendly athletic layering designed for lounge-to-lobby movement.',
    setting: 'Clubhouse terrace',
    featuredQuote: 'Sporting pieces become luxurious when the palette is restrained and the silhouette stays neat.',
    palette: ['Heather grey', 'Navy', 'Bone'],
    story: [
      {
        heading: 'Recovery hour',
        text: 'The quarter-zip and tapered jogger feel athletic, but the restrained palette keeps the look polished enough for the city.',
      },
      {
        heading: 'In transit',
        text: 'Lightweight trainers and compact layers make the outfit ideal for departures, arrivals, and long hotel corridors.',
      },
    ],
    merchandising: [
      {
        category: 'Top',
        label: 'Cotton quarter-zip',
        note: 'A structured sporting staple with a soft handfeel.',
      },
      {
        category: 'Pant',
        label: 'Tapered travel jogger',
        note: 'Clean at the ankle and easy through the thigh.',
      },
      {
        category: 'Footwear',
        label: 'Minimal runner',
        note: 'Performance comfort without technical noise.',
      },
    ],
    collectionSlug: 'sporting-club',
    sortOrder: 4,
  },
  'morning-lap': {
    subtitle: 'Outdoor training cues translated into a calm, estate-side uniform.',
    setting: 'Reservoir path',
    featuredQuote: 'Sport can still feel refined when the kit is spare and the color story stays dry.',
    palette: ['Olive', 'Stone', 'Cloud'],
    story: [
      {
        heading: 'Fresh start',
        text: 'A tech shell and shorts give the silhouette purpose, while tonal styling keeps it from feeling purely technical.',
      },
      {
        heading: 'Weekend utility',
        text: 'Trail runners and a quiet shell make the look useful for both training laps and unhurried errands afterwards.',
      },
    ],
    merchandising: [
      {
        category: 'Shell',
        label: 'Lightweight running shell',
        note: 'Weather-ready without adding visual bulk.',
      },
      {
        category: 'Short',
        label: 'Performance short',
        note: 'A sporty staple reined in through a neutral palette.',
      },
      {
        category: 'Footwear',
        label: 'Trail runner',
        note: 'Stable underfoot for city parks and gravel paths alike.',
      },
    ],
    collectionSlug: 'sporting-club',
    sortOrder: 5,
  },
  'weekend-stride': {
    subtitle: 'Retro athletic notes for a slower morning with coffee, papers, and no formal agenda.',
    setting: 'Club drive',
    featuredQuote: 'Weekend sportswear feels elevated when every layer carries the same quiet tempo.',
    palette: ['Cream', 'Forest', 'Washed navy'],
    story: [
      {
        heading: 'Off-duty rhythm',
        text: 'A track jacket and nylon short keep the line clean, while soft vintage colors add character without volume.',
      },
      {
        heading: 'After the warm-up',
        text: 'The retro trainer makes the look casual enough for a coffee run but polished enough to stay on all afternoon.',
      },
    ],
    merchandising: [
      {
        category: 'Jacket',
        label: 'Striped track jacket',
        note: 'A heritage-sport reference toned down for everyday use.',
      },
      {
        category: 'Short',
        label: 'Nylon sport short',
        note: 'Lightweight and clean, with an easy drape.',
      },
      {
        category: 'Footwear',
        label: 'Retro trainer',
        note: 'Low profile and quietly nostalgic.',
      },
    ],
    collectionSlug: 'sporting-club',
    sortOrder: 6,
  },
  'court-warmup': {
    subtitle: 'A transitional travel look grounded in tennis-club restraint rather than overt performance.',
    setting: 'Terminal lounge',
    featuredQuote: 'Travel dressing feels richer when it borrows from sport without looking technical.',
    palette: ['Navy', 'White', 'Heather grey'],
    story: [
      {
        heading: 'Transit uniform',
        text: 'The zip shell and tapered pant move like athleticwear but present with much more control.',
      },
      {
        heading: 'Country-club influence',
        text: 'A neutral trainer and spare palette borrow the poise of court dress without feeling nostalgic.',
      },
    ],
    merchandising: [
      {
        category: 'Outer',
        label: 'Travel zip shell',
        note: 'Smooth enough to double as a light jacket on arrival.',
      },
      {
        category: 'Trouser',
        label: 'Tapered jersey pant',
        note: 'Relaxed through the seat with a narrow finish.',
      },
      {
        category: 'Footwear',
        label: 'Cushioned runner',
        note: 'Made for long concourses and quick transfers.',
      },
    ],
    collectionSlug: 'sporting-club',
    sortOrder: 7,
  },
  'sand-stone': {
    subtitle: 'Resort neutrals with the polish of tailored separates and terrace-ready ease.',
    setting: 'Coastal veranda',
    featuredQuote: 'Luxury summer dressing often comes down to texture, air, and the confidence to keep the palette simple.',
    palette: ['Sand', 'Ecru', 'Sun-faded taupe'],
    story: [
      {
        heading: 'Holiday tailoring',
        text: 'The knit polo and wide-leg trouser soften the line, creating a silhouette that feels expansive rather than oversized.',
      },
      {
        heading: 'By the water',
        text: 'Slides and warm neutrals keep the outfit light, ideal for late lunches and days that move between indoors and out.',
      },
    ],
    merchandising: [
      {
        category: 'Top',
        label: 'Textured knit polo',
        note: 'Breathable and polished, with a richer hand than jersey.',
      },
      {
        category: 'Trouser',
        label: 'Wide-leg summer trouser',
        note: 'Fluid through the leg for heat and movement.',
      },
      {
        category: 'Finish',
        label: 'Leather slide',
        note: 'Minimal footwear that keeps the look effortless.',
      },
    ],
    collectionSlug: 'estate-weekend',
    sortOrder: 8,
  },
  'paper-white': {
    subtitle: 'High-summer dressing sharpened into a gallery-going uniform with almost no visible effort.',
    setting: 'Private gallery',
    featuredQuote: 'White reads most luxurious when the silhouette is easy and the fabrics are visibly fine.',
    palette: ['Paper white', 'Oat', 'Warm stone'],
    story: [
      {
        heading: 'Summer clarity',
        text: 'A poplin shirt and cropped trouser create a clean line that lets material and proportion take center stage.',
      },
      {
        heading: 'Quiet contrast',
        text: 'Softly tonal accessories keep the all-light palette grounded without interrupting its simplicity.',
      },
    ],
    merchandising: [
      {
        category: 'Shirt',
        label: 'Poplin camp shirt',
        note: 'A crisp top layer for warm city days.',
      },
      {
        category: 'Trouser',
        label: 'Cropped summer trouser',
        note: 'A slightly shorter break to keep the look airy.',
      },
      {
        category: 'Footwear',
        label: 'Minimal leather sneaker',
        note: 'Keeps the look urban and easy to wear.',
      },
    ],
    collectionSlug: 'estate-weekend',
    sortOrder: 9,
  },
  'soft-monochrome': {
    subtitle: 'A city-weekend uniform built from one tonal family and finished with soft leather.',
    setting: 'Brownstone courtyard',
    featuredQuote: 'Monochrome feels less strict when knitwear, drape, and footwear each soften a different part of the silhouette.',
    palette: ['Stone', 'Taupe', 'Soft grey'],
    story: [
      {
        heading: 'Tonal dressing',
        text: 'Fine knitwear and a relaxed trouser hold the palette together while introducing subtle changes in texture.',
      },
      {
        heading: 'Weekend polish',
        text: 'A loafer adds maturity without making the look feel dressed up, keeping the outfit versatile across the day.',
      },
    ],
    merchandising: [
      {
        category: 'Knit',
        label: 'Fine merino crew',
        note: 'A soft foundation that keeps the look minimal.',
      },
      {
        category: 'Trouser',
        label: 'Relaxed tailored trouser',
        note: 'Fluid through the leg and easy at the waist.',
      },
      {
        category: 'Footwear',
        label: 'Soft leather loafer',
        note: 'A refined finish that still feels casual.',
      },
    ],
    collectionSlug: 'estate-weekend',
    sortOrder: 10,
  },
  'crosswalk-khaki': {
    subtitle: 'Utility streetwear recast through cleaner lines, warmer neutrals, and quieter hardware.',
    setting: 'Downtown avenue',
    featuredQuote: 'Streetwear matures when the color palette calms down and each proportion is carefully set.',
    palette: ['Khaki', 'Black', 'Soft cement'],
    story: [
      {
        heading: 'Urban line',
        text: 'A boxy overshirt and relaxed chino keep the look grounded in movement while toning down the noise.',
      },
      {
        heading: 'Elevated utility',
        text: 'Low-profile footwear trims the silhouette and lets the outer layer become the main gesture.',
      },
    ],
    merchandising: [
      {
        category: 'Overshirt',
        label: 'Boxy utility overshirt',
        note: 'A workwear shape made cleaner through fabric and hardware.',
      },
      {
        category: 'Trouser',
        label: 'Relaxed chino',
        note: 'Straight enough to anchor the wider top block.',
      },
      {
        category: 'Footwear',
        label: 'Low-profile sneaker',
        note: 'Keeps the outfit modern without adding weight.',
      },
    ],
    collectionSlug: 'metropolitan-casual',
    sortOrder: 11,
  },
  'neon-borough': {
    subtitle: 'Night-focused city layering that trims technical references into something more polished.',
    setting: 'Midtown after dark',
    featuredQuote: 'The right shell and denim pairing can feel directional without tipping into overt performance gear.',
    palette: ['Graphite', 'Black', 'Electric olive'],
    story: [
      {
        heading: 'After-hours city',
        text: 'A technical shell gives the look energy, while wide-leg denim keeps the proportions easy and fashion-aware.',
      },
      {
        heading: 'Modern utility',
        text: 'Trail-inspired footwear adds grip and motion, but the restrained palette keeps the outfit in the luxury lane.',
      },
    ],
    merchandising: [
      {
        category: 'Shell',
        label: 'Technical city shell',
        note: 'Cleanly cut with just enough sport in the details.',
      },
      {
        category: 'Denim',
        label: 'Wide-leg denim',
        note: 'A fuller trouser that sharpens the attitude of the look.',
      },
      {
        category: 'Footwear',
        label: 'Trail runner',
        note: 'Brings traction and a subtle outdoor note.',
      },
    ],
    collectionSlug: 'metropolitan-casual',
    sortOrder: 12,
  },
  'utility-grain': {
    subtitle: 'Heritage workwear built from canvas, denim, and service-ready leather with a refined pace.',
    setting: 'Workshop quarter',
    featuredQuote: 'Workwear becomes elegant when the fabric stories stay honest and the finish remains spare.',
    palette: ['Tobacco', 'Indigo', 'Aged brass'],
    story: [
      {
        heading: 'Craft and utility',
        text: 'Canvas outerwear and straight denim make the look durable, but the styling is clean enough for everyday city wear.',
      },
      {
        heading: 'Heritage finish',
        text: 'A service boot adds depth and weight, grounding the look in practical tradition rather than costume.',
      },
    ],
    merchandising: [
      {
        category: 'Outer',
        label: 'Canvas overshirt',
        note: 'Built with utility in mind and softened through repeated wear.',
      },
      {
        category: 'Denim',
        label: 'Straight raw denim',
        note: 'A durable base that wears in over time.',
      },
      {
        category: 'Footwear',
        label: 'Service boot',
        note: 'Adds structure and a heritage note to the silhouette.',
      },
    ],
    collectionSlug: 'field-uniform',
    sortOrder: 13,
  },
  'forge-layer': {
    subtitle: 'A rain-minded workwear chapter that mixes denim, painter silhouettes, and heavier ground.',
    setting: 'Market lane',
    featuredQuote: 'The refinement in workwear comes from edit: fewer pockets, better fabric, stronger proportion.',
    palette: ['Denim blue', 'Moss', 'Weathered brown'],
    story: [
      {
        heading: 'Weather shift',
        text: 'The denim shirt and painter pant keep the outfit straightforward while allowing texture to do most of the work.',
      },
      {
        heading: 'Grounded finish',
        text: 'A moc boot lends weight and shape, making the look suitable for damp pavements and rougher surfaces alike.',
      },
    ],
    merchandising: [
      {
        category: 'Shirt',
        label: 'Denim work shirt',
        note: 'A sturdy top layer that still reads neat under a coat.',
      },
      {
        category: 'Trouser',
        label: 'Painter pant',
        note: 'Relaxed through the seat with a practical, heritage stance.',
      },
      {
        category: 'Footwear',
        label: 'Moc boot',
        note: 'Heavy enough to finish the look with intent.',
      },
    ],
    collectionSlug: 'field-uniform',
    sortOrder: 14,
  },
};

function isStyleTag(value: unknown): value is StyleTag {
  return (
    value === 'minimal' ||
    value === 'streetwear' ||
    value === 'classic' ||
    value === 'athleisure' ||
    value === 'workwear'
  );
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeStory(value: unknown, title: string, subtitle: string): StoryBeat[] {
  if (Array.isArray(value)) {
    const beats = value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const beat = entry as Partial<StoryBeat>;
        if (typeof beat.heading !== 'string' || typeof beat.text !== 'string') {
          return null;
        }

        return {
          heading: beat.heading,
          text: beat.text,
        };
      })
      .filter((entry): entry is StoryBeat => entry !== null);

    if (beats.length > 0) {
      return beats;
    }
  }

  return [
    {
      heading: 'The mood',
      text: subtitle,
    },
    {
      heading: 'How to wear it',
      text: `${title} layers understated staples with a deliberate mix of texture and ease.`,
    },
  ];
}

function normalizeMerchandising(value: unknown, keyItems: string[]): MerchandisingItem[] {
  if (Array.isArray(value)) {
    const merchandising = value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const item = entry as Partial<MerchandisingItem>;
        if (
          typeof item.category !== 'string' ||
          typeof item.label !== 'string' ||
          typeof item.note !== 'string'
        ) {
          return null;
        }

        return {
          category: item.category,
          label: item.label,
          note: item.note,
        };
      })
      .filter((entry): entry is MerchandisingItem => entry !== null);

    if (merchandising.length > 0) {
      return merchandising;
    }
  }

  return keyItems.map((item, index) => ({
    category: ['Layer', 'Base', 'Finish'][index] ?? `Piece ${index + 1}`,
    label: item,
    note: 'Core wardrobe piece in the look.',
  }));
}

function normalizeLook(value: unknown, index: number): Look | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const rawLook = value as Partial<Look> & {
    keyItems?: unknown;
    palette?: unknown;
    gallery?: unknown;
    story?: unknown;
    merchandising?: unknown;
  };

  if (
    typeof rawLook.id !== 'string' ||
    typeof rawLook.title !== 'string' ||
    !isStyleTag(rawLook.tag) ||
    typeof rawLook.season !== 'string' ||
    typeof rawLook.occasion !== 'string' ||
    typeof rawLook.hero !== 'string'
  ) {
    return null;
  }

  const overrides = EDITORIAL_LOOK_OVERRIDES[rawLook.id] ?? {};
  const keyItems = toStringList(rawLook.keyItems);
  const palette = overrides.palette ?? toStringList(rawLook.palette);
  const subtitle =
    typeof overrides.subtitle === 'string'
      ? overrides.subtitle
      : typeof rawLook.subtitle === 'string'
        ? rawLook.subtitle
      : `${rawLook.season} dressing for ${rawLook.occasion.toLowerCase()}.`;

  return {
    id: rawLook.id,
    title: rawLook.title,
    subtitle,
    tag: rawLook.tag,
    season: rawLook.season,
    occasion: rawLook.occasion,
    setting:
      typeof overrides.setting === 'string'
        ? overrides.setting
        : typeof rawLook.setting === 'string'
          ? rawLook.setting
          : rawLook.occasion,
    featuredQuote:
      typeof overrides.featuredQuote === 'string'
        ? overrides.featuredQuote
        : typeof rawLook.featuredQuote === 'string'
          ? rawLook.featuredQuote
        : 'A relaxed look with the confidence of a fully considered wardrobe.',
    keyItems,
    palette,
    hero: rawLook.hero,
    gallery: toStringList(rawLook.gallery),
    story: normalizeStory(overrides.story ?? rawLook.story, rawLook.title, subtitle),
    merchandising: normalizeMerchandising(
      overrides.merchandising ?? rawLook.merchandising,
      keyItems
    ),
    collectionSlug:
      typeof overrides.collectionSlug === 'string'
        ? overrides.collectionSlug
        : typeof rawLook.collectionSlug === 'string'
          ? rawLook.collectionSlug
        : rawLook.tag === 'classic'
          ? 'townhouse-evening'
          : rawLook.tag === 'athleisure'
            ? 'sporting-club'
            : rawLook.tag === 'minimal'
              ? 'estate-weekend'
              : rawLook.tag === 'streetwear'
                ? 'metropolitan-casual'
                : 'field-uniform',
    sortOrder:
      typeof overrides.sortOrder === 'number'
        ? overrides.sortOrder
        : typeof rawLook.sortOrder === 'number'
          ? rawLook.sortOrder
          : index + 1,
  };
}

function normalizeLooks(value: unknown): Look[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry, index) => normalizeLook(entry, index))
    .filter((entry): entry is Look => entry !== null)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function buildCollections(looks: Look[]): EditorialCollection[] {
  return Object.values(COLLECTION_DEFINITIONS)
    .map((definition) => {
      const lookIds = looks
        .filter((look) => look.collectionSlug === definition.slug)
        .map((look) => look.id);

      if (lookIds.length === 0) {
        return null;
      }

      return {
        ...definition,
        coverLookId: lookIds[0],
        lookIds,
      };
    })
    .filter((collection): collection is EditorialCollection => collection !== null);
}

function normalizeCatalog(value: unknown): Catalog | null {
  if (Array.isArray(value)) {
    const looks = normalizeLooks(value);
    if (looks.length === 0) {
      return null;
    }

    return {
      looks,
      collections: buildCollections(looks),
      featuredLookId: looks.some((look) => look.id === DEFAULT_FEATURED_LOOK_ID)
        ? DEFAULT_FEATURED_LOOK_ID
        : looks[0].id,
      seasonLabel: DEFAULT_SEASON_LABEL,
      marketNote: DEFAULT_MARKET_NOTE,
    };
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const rawCatalog = value as Partial<Catalog> & { looks?: unknown };
  const looks = normalizeLooks(rawCatalog.looks);
  if (looks.length === 0) {
    return null;
  }

  const defaultCollections = buildCollections(looks);
  const featuredLookId =
    typeof rawCatalog.featuredLookId === 'string' &&
    looks.some((look) => look.id === rawCatalog.featuredLookId)
      ? rawCatalog.featuredLookId
      : looks.some((look) => look.id === DEFAULT_FEATURED_LOOK_ID)
        ? DEFAULT_FEATURED_LOOK_ID
        : looks[0].id;

  return {
    looks,
    collections: defaultCollections,
    featuredLookId,
    seasonLabel:
      typeof rawCatalog.seasonLabel === 'string'
        ? rawCatalog.seasonLabel
        : DEFAULT_SEASON_LABEL,
    marketNote:
      typeof rawCatalog.marketNote === 'string'
        ? rawCatalog.marketNote
        : DEFAULT_MARKET_NOTE,
  };
}

export async function fetchCatalog(): Promise<Catalog> {
  try {
    const raw = sessionStorage.getItem(STORAGE_MCP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      const normalized = normalizeCatalog(parsed);
      if (normalized) {
        return normalized;
      }
    }
  } catch {
    // ignore session override issues and fall back to the bundled catalog
  }

  return normalizeCatalog({ looks: seedLooks }) as Catalog;
}

export async function fetchLooks(): Promise<Look[]> {
  const catalog = await fetchCatalog();
  return catalog.looks;
}
