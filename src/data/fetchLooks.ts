import type { Look } from '../types';
import seedLooks from './looks.json';

/** Bump when seed shape or image strategy changes so stale session overrides are ignored. */
export const LOOKBOOK_LOOKS_SESSION_KEY = 'lookbook_mcp_looks_v13';

/**
 * MVP: seed JSON is the default. If you later wire an MCP tool or API,
 * write JSON.stringify(looks) to sessionStorage under LOOKBOOK_LOOKS_SESSION_KEY
 * before load, or replace this function to fetch from your endpoint.
 */
export async function fetchLooks(): Promise<Look[]> {
  try {
    const raw = sessionStorage.getItem(LOOKBOOK_LOOKS_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Look[];
      }
    }
  } catch {
    // ignore
  }
  return seedLooks as Look[];
}
