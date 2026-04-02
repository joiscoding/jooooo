import { describe, expect, it } from 'vitest';
import { buildCanonicalPageUrl } from './canonicalUrl';

describe('buildCanonicalPageUrl', () => {
  it('joins origin and pathname without query or hash', () => {
    expect(buildCanonicalPageUrl('https://example.com', '/look/abc')).toBe(
      'https://example.com/look/abc',
    );
  });

  it('normalizes origin trailing slash', () => {
    expect(buildCanonicalPageUrl('https://example.com/', '/albums')).toBe(
      'https://example.com/albums',
    );
  });

  it('ensures pathname starts with slash', () => {
    expect(buildCanonicalPageUrl('https://x.test', 'look/1')).toBe(
      'https://x.test/look/1',
    );
  });
});
