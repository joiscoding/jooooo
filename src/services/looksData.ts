import seedLooks from '../data/seedLooks.json';
import type { Look, StyleTag } from '../types';
import { STYLE_TAGS } from '../types';

function isLookArray(data: unknown): data is Look[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'title' in item &&
      'primaryTag' in item &&
      'heroImage' in item &&
      STYLE_TAGS.includes((item as Look).primaryTag as StyleTag)
  );
}

/**
 * Fetches looks from an optional HTTP source (e.g. MCP-backed JSON endpoint).
 * Set `VITE_LOOKS_API_URL` to a URL that returns JSON: Look[]
 */
export async function fetchLooks(): Promise<Look[]> {
  const url = import.meta.env.VITE_LOOKS_API_URL as string | undefined;
  if (!url) {
    return seedLooks as Look[];
  }
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    if (isLookArray(json) && json.length > 0) return json;
  } catch {
    /* fall through */
  }
  return seedLooks as Look[];
}

export function getSeedLooksSync(): Look[] {
  return seedLooks as Look[];
}
