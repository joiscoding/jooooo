import { describe, expect, it, vi, afterEach } from 'vitest';
import { getCanonicalPageUrl, getCanonicalUrlForPath } from './canonicalUrl';

describe('canonicalUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getCanonicalPageUrl returns origin + pathname', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://lookbook.example',
        pathname: '/look/l1',
      },
    });
    expect(getCanonicalPageUrl()).toBe('https://lookbook.example/look/l1');
  });

  it('getCanonicalUrlForPath joins origin and path', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://lookbook.example',
        pathname: '/',
      },
    });
    expect(getCanonicalUrlForPath('/albums/a1')).toBe(
      'https://lookbook.example/albums/a1'
    );
    expect(getCanonicalUrlForPath('albums/a1')).toBe(
      'https://lookbook.example/albums/a1'
    );
  });
});
