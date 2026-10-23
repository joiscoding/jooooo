import type { Look } from '../types';
import seedLooks from './looks.json';
import { STYLE_ORDER } from '../types';

/** Bump when seed shape or image strategy changes so stale session overrides are ignored. */
const STORAGE_MCP_KEY = 'lookbook_mcp_looks_v13';

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
    candidate.id.length > 0 &&
    typeof candidate.title === 'string' &&
    candidate.title.length > 0 &&
    typeof candidate.tag === 'string' &&
    STYLE_ORDER.includes(candidate.tag as Look['tag']) &&
    typeof candidate.season === 'string' &&
    typeof candidate.occasion === 'string' &&
    isStringArray(candidate.keyItems) &&
    typeof candidate.hero === 'string' &&
    isStringArray(candidate.gallery)
  );
}

function parseLookArray(value: unknown): Look[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const seenIds = new Set<string>();
  const looks: Look[] = [];

  for (const item of value) {
    if (!isLook(item) || seenIds.has(item.id)) {
      return null;
    }
    seenIds.add(item.id);
    looks.push(item);
  }

  return looks;
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
      const sessionLooks = parseLookArray(parsed);
      if (sessionLooks) {
        return sessionLooks;
      }
      sessionStorage.removeItem(STORAGE_MCP_KEY);
    }
  } catch {
    // ignore
  }
  return seedLooks as Look[];
}
