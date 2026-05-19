import { describe, expect, it } from 'vitest';
import { buildCanonicalPageUrl } from './canonicalUrl';

describe('buildCanonicalPageUrl', () => {
  it('joins origin and pathname', () => {
    expect(buildCanonicalPageUrl('https://example.com', '/look/abc')).toBe(
      'https://example.com/look/abc',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(buildCanonicalPageUrl('https://example.com/', '/albums')).toBe(
      'https://example.com/albums',
    );
  });

  it('prefixes pathname when missing leading slash', () => {
    expect(buildCanonicalPageUrl('http://localhost:5173', 'look/x')).toBe(
      'http://localhost:5173/look/x',
    );
  });
});
