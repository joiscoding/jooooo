import { describe, expect, it } from 'vitest';
import { buildCanonicalPageUrl } from './canonicalUrl';

describe('buildCanonicalPageUrl', () => {
  it('joins origin and pathname', () => {
    expect(buildCanonicalPageUrl('https://example.com', '/look/abc')).toBe(
      'https://example.com/look/abc',
    );
  });

  it('adds leading slash when pathname omits it', () => {
    expect(buildCanonicalPageUrl('https://example.com', 'albums')).toBe(
      'https://example.com/albums',
    );
  });

  it('strips query and hash from pathname input', () => {
    expect(
      buildCanonicalPageUrl('https://example.com', '/look/x?q=1#h'),
    ).toBe('https://example.com/look/x');
  });
});
