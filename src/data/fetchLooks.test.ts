import { afterEach, describe, expect, it } from 'vitest';
import { fetchLooks } from './fetchLooks';
import seedLooks from './looks.json';

const STORAGE_MCP_KEY = 'lookbook_mcp_looks_v13';

describe('fetchLooks', () => {
  afterEach(() => {
    sessionStorage.removeItem(STORAGE_MCP_KEY);
  });

  it('returns seed catalog when session override is absent', async () => {
    const looks = await fetchLooks();
    expect(looks.length).toBeGreaterThan(0);
    expect(looks[0]).toEqual(seedLooks[0]);
  });

  it('honors an empty session override', async () => {
    sessionStorage.setItem(STORAGE_MCP_KEY, '[]');
    const looks = await fetchLooks();
    expect(looks).toEqual([]);
  });
});
