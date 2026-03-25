import type { Look, StyleTag } from '../types';
import seedLooks from './looks.json';

/** Bump when seed shape or image strategy changes so stale session overrides are ignored. */
const STORAGE_MCP_KEY = 'lookbook_mcp_looks_v13';
const STYLE_TAGS: StyleTag[] = ['minimal', 'streetwear', 'classic', 'athleisure', 'workwear'];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isLook(value: unknown): value is Look {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.tag === 'string' &&
    STYLE_TAGS.includes(candidate.tag as StyleTag) &&
    typeof candidate.season === 'string' &&
    typeof candidate.occasion === 'string' &&
    typeof candidate.hero === 'string' &&
    isStringArray(candidate.keyItems) &&
    isStringArray(candidate.gallery)
  );
}

function isLookArray(value: unknown): value is Look[] {
  return Array.isArray(value) && value.length > 0 && value.every(isLook);
}

/**
 * MVP: seed JSON is the default. If you later wire an MCP tool or API,
 * write JSON.stringify(looks) to sessionStorage under STORAGE_MCP_KEY
 * before load, or replace this function to fetch from your endpoint.
 */
export async function fetchLooks(): Promise<Look[]> {
  try {
    const raw = sessionStorage.getItem(STORAGE_MCP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (isLookArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return seedLooks as Look[];
}
