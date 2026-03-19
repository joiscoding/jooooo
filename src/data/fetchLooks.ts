import type { Look } from '../types';
import seedLooks from './looks.json';

const STORAGE_MCP_KEY = 'lookbook_mcp_looks';

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
