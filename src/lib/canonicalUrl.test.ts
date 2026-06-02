import { describe, expect, it } from 'vitest';
import { getCanonicalUrl, getCanonicalUrlForPath } from './canonicalUrl';

describe('getCanonicalUrl', () => {
  it('returns origin plus pathname without query or hash', () => {
    expect(
      getCanonicalUrl({
        origin: 'https://lookbook.example',
        pathname: '/look/abc',
      }),
    ).toBe('https://lookbook.example/look/abc');
  });

  it('normalizes empty pathname to slash', () => {
    expect(
      getCanonicalUrl({
        origin: 'https://lookbook.example',
        pathname: '',
      }),
    ).toBe('https://lookbook.example/');
  });
});

describe('getCanonicalUrlForPath', () => {
  it('prefixes relative paths with current origin', () => {
    const url = getCanonicalUrlForPath('/look/x');
    expect(url).toBe(`${window.location.origin}/look/x`);
  });
});
