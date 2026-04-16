import { describe, expect, it } from 'vitest';
import { buildCanonicalPageUrl, buildCanonicalUrlForPath } from './canonicalUrl';

describe('buildCanonicalPageUrl', () => {
  it('uses origin and pathname only', () => {
    expect(
      buildCanonicalPageUrl({
        origin: 'https://example.com',
        pathname: '/look/abc',
      })
    ).toBe('https://example.com/look/abc');
  });

  it('defaults empty pathname to slash', () => {
    expect(
      buildCanonicalPageUrl({
        origin: 'https://example.com',
        pathname: '',
      })
    ).toBe('https://example.com/');
  });
});

describe('buildCanonicalUrlForPath', () => {
  it('prefixes path without leading slash', () => {
    expect(buildCanonicalUrlForPath('https://x.test', 'albums/1')).toBe(
      'https://x.test/albums/1'
    );
  });

  it('keeps leading slash', () => {
    expect(buildCanonicalUrlForPath('https://x.test', '/look/1')).toBe(
      'https://x.test/look/1'
    );
  });
});
