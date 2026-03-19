import { seedLooks } from './seedLooks'
import { STYLE_TAGS } from '../types'
import type { Look, LookSourceResult, StyleTagId } from '../types'

const configuredEndpoint = import.meta.env.VITE_LOOKS_ENDPOINT?.trim()

const styleTagIds = new Set<StyleTagId>(STYLE_TAGS.map((tag) => tag.id))

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(hasText)
}

function isStyleTagId(value: unknown): value is StyleTagId {
  return typeof value === 'string' && styleTagIds.has(value as StyleTagId)
}

function isLook(value: unknown): value is Look {
  if (!value || typeof value !== 'object') {
    return false
  }

  const look = value as Record<string, unknown>

  return (
    hasText(look.id) &&
    hasText(look.slug) &&
    hasText(look.title) &&
    hasText(look.label) &&
    isStyleTagId(look.styleTag) &&
    hasText(look.season) &&
    hasText(look.occasion) &&
    hasText(look.category) &&
    hasText(look.summary) &&
    hasText(look.description) &&
    hasText(look.heroImage) &&
    isStringArray(look.gallery) &&
    isStringArray(look.keyItems) &&
    hasText(look.imageAlt)
  )
}

function normalizePayload(payload: unknown): Look[] {
  if (Array.isArray(payload)) {
    return payload.filter(isLook)
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { looks?: unknown }

    if (Array.isArray(candidate.looks)) {
      return candidate.looks.filter(isLook)
    }
  }

  return []
}

export async function loadLooks(): Promise<LookSourceResult> {
  if (!configuredEndpoint) {
    return {
      looks: seedLooks,
      source: 'seed',
    }
  }

  try {
    const response = await fetch(configuredEndpoint, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Remote look feed failed with ${response.status}`)
    }

    const payload = await response.json()
    const looks = normalizePayload(payload)

    if (!looks.length) {
      throw new Error('Remote look feed returned no usable looks')
    }

    return {
      looks,
      source: 'remote',
      endpoint: configuredEndpoint,
    }
  } catch (error) {
    console.warn('Falling back to seed looks.', error)

    return {
      looks: seedLooks,
      source: 'seed',
      endpoint: configuredEndpoint,
    }
  }
}
