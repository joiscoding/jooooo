import { describe, expect, it } from 'vitest';
import { canonicalPageUrl } from './canonicalUrl';

describe('canonicalPageUrl', () => {
  it('joins origin and pathname', () => {
    expect(canonicalPageUrl('https://example.com', '/look/abc')).toBe(
      'https://example.com/look/abc',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(canonicalPageUrl('https://example.com/', '/albums')).toBe(
      'https://example.com/albums',
    );
  });

  it('prefixes pathname when missing leading slash', () => {
    expect(canonicalPageUrl('https://example.com', 'look/x')).toBe(
      'https://example.com/look/x',
    );
  });
});
