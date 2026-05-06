import { describe, expect, it } from 'vitest';
import { buildCanonicalUrl, normalizePathname } from './canonicalUrl';

describe('normalizePathname', () => {
  it('adds a leading slash when missing', () => {
    expect(normalizePathname('foo/bar')).toBe('/foo/bar');
  });

  it('preserves leading slash', () => {
    expect(normalizePathname('/albums/x')).toBe('/albums/x');
  });
});

describe('buildCanonicalUrl', () => {
  it('joins origin and path without double slashes', () => {
    expect(buildCanonicalUrl('https://example.com', '/look/a')).toBe(
      'https://example.com/look/a',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(buildCanonicalUrl('https://example.com/', '/')).toBe(
      'https://example.com/',
    );
  });
});
