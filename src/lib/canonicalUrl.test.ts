import { describe, expect, it } from 'vitest';
import { canonicalUrlForPath, canonicalUrlFromLocation } from './canonicalUrl';

describe('canonicalUrlFromLocation', () => {
  it('combines origin and pathname', () => {
    expect(
      canonicalUrlFromLocation({
        origin: 'https://example.com',
        pathname: '/look/abc',
      }),
    ).toBe('https://example.com/look/abc');
  });

  it('uses slash for empty pathname', () => {
    expect(
      canonicalUrlFromLocation({ origin: 'https://example.com', pathname: '' }),
    ).toBe('https://example.com/');
  });
});

describe('canonicalUrlForPath', () => {
  it('prefixes path with slash when missing', () => {
    expect(canonicalUrlForPath('https://x.test', 'albums/1')).toBe(
      'https://x.test/albums/1',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(canonicalUrlForPath('https://x.test/', '/p')).toBe('https://x.test/p');
  });
});
