export const STYLE_TAGS = [
  {
    id: 'minimal-quiet',
    label: 'Minimal / quiet',
    accent: 'var(--accent-stone)',
    description: 'Restrained layers, soft tailoring, and quiet neutrals.',
  },
  {
    id: 'streetwear-urban',
    label: 'Streetwear / urban',
    accent: 'var(--accent-charcoal)',
    description: 'Utility cues, sneakers, and relaxed city layering.',
  },
  {
    id: 'classic-tailored',
    label: 'Classic / tailored',
    accent: 'var(--accent-olive)',
    description: 'Structure, polish, and dress-casual balance.',
  },
  {
    id: 'athleisure-sporty',
    label: 'Athleisure / sporty',
    accent: 'var(--accent-slate)',
    description: 'Performance-inspired shapes with an easy tempo.',
  },
  {
    id: 'workwear-heritage',
    label: 'Workwear / heritage',
    accent: 'var(--accent-rust)',
    description: 'Durable textures, chore layers, and grounded utility.',
  },
] as const

export type StyleTagId = (typeof STYLE_TAGS)[number]['id']

export interface Look {
  id: string
  slug: string
  title: string
  label: string
  styleTag: StyleTagId
  season: string
  occasion: string
  category: string
  summary: string
  description: string
  heroImage: string
  gallery: string[]
  keyItems: string[]
  imageAlt: string
}

export interface AlbumLink {
  id: string
  label: string
  url: string
}

export interface Album {
  id: string
  name: string
  note: string
  lookIds: string[]
  links: AlbumLink[]
  createdAt: string
  updatedAt: string
}

export interface LookSourceResult {
  looks: Look[]
  source: 'remote' | 'seed'
  endpoint?: string
}
