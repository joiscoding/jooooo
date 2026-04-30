import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { canonicalPageUrl } from './canonicalUrl';

describe('canonicalPageUrl', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: { origin: 'https://example.com' },
    } as Window & typeof globalThis);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('joins origin and pathname', () => {
    expect(canonicalPageUrl('/look/abc')).toBe('https://example.com/look/abc');
  });

  it('normalizes pathname without leading slash', () => {
    expect(canonicalPageUrl('albums/x')).toBe('https://example.com/albums/x');
  });
});
