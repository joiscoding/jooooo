import type { Look } from '../types';
import seedLooks from './looks.json';

/** Bump when seed shape or image strategy changes so stale session overrides are ignored. */
const STORAGE_MCP_KEY = 'lookbook_mcp_looks_v13';

/** Exposed for empty-state "restore sample looks" and tests. */
export const LOOKS_SESSION_STORAGE_KEY = STORAGE_MCP_KEY;

export function clearStoredLooksAndReload(): void {
  try {
    sessionStorage.removeItem(STORAGE_MCP_KEY);
  } catch {
    // ignore
  }
  globalThis.location.reload();
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Look[];
      }
    }
  } catch {
    // ignore
  }
  return seedLooks as Look[];
}
