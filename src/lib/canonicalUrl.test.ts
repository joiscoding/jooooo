import { describe, expect, it } from 'vitest';
import { buildCanonicalUrl } from './canonicalUrl';

describe('buildCanonicalUrl', () => {
  it('joins origin and path with no trailing slash on origin', () => {
    expect(buildCanonicalUrl('https://app.example', '/look/abc')).toBe(
      'https://app.example/look/abc'
    );
  });

  it('strips trailing slash on origin', () => {
    expect(buildCanonicalUrl('https://app.example/', '/albums/x')).toBe(
      'https://app.example/albums/x'
    );
  });

  it('uses root when pathname is empty', () => {
    expect(buildCanonicalUrl('https://x.test', '')).toBe('https://x.test/');
  });

  it('adds search when provided without question mark', () => {
    expect(
      buildCanonicalUrl('https://a.test', '/p', 'ref=1')
    ).toBe('https://a.test/p?ref=1');
  });

  it('keeps search when it already has ?', () => {
    expect(
      buildCanonicalUrl('https://a.test', '/p', '?ref=1')
    ).toBe('https://a.test/p?ref=1');
  });
});
