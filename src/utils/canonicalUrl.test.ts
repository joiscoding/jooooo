import { describe, expect, it } from 'vitest';
import { getCanonicalUrl } from './canonicalUrl';

describe('getCanonicalUrl', () => {
  it('combines origin and pathname', () => {
    expect(getCanonicalUrl('/look/abc', 'https://lookbook.example')).toBe(
      'https://lookbook.example/look/abc',
    );
  });

  it('normalizes pathname without leading slash', () => {
    expect(getCanonicalUrl('albums/1', 'https://lookbook.example')).toBe(
      'https://lookbook.example/albums/1',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(getCanonicalUrl('/', 'https://lookbook.example/')).toBe(
      'https://lookbook.example/',
    );
  });

  it('strips query and hash from pathname', () => {
    expect(
      getCanonicalUrl('/look/abc?filter=minimal#top', 'https://lookbook.example'),
    ).toBe('https://lookbook.example/look/abc');
  });
});
