import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildCanonicalUrl, canonicalUrlFromWindow } from './canonicalUrl';

describe('buildCanonicalUrl', () => {
  it('joins origin and pathname', () => {
    expect(buildCanonicalUrl('https://example.com', '/look/abc')).toBe(
      'https://example.com/look/abc',
    );
  });

  it('adds leading slash when pathname omits it', () => {
    expect(buildCanonicalUrl('https://example.com', 'albums/x')).toBe(
      'https://example.com/albums/x',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(buildCanonicalUrl('https://example.com/', '/')).toBe(
      'https://example.com/',
    );
  });
});

describe('canonicalUrlFromWindow', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses window.location origin and pathname', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://app.test',
        pathname: '/look/xyz',
      },
    });

    expect(canonicalUrlFromWindow()).toBe('https://app.test/look/xyz');
  });
});
