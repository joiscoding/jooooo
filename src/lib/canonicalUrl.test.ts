import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  canonicalPageUrl,
  canonicalUrlForPath,
  joinOriginAndPath,
} from './canonicalUrl';

describe('joinOriginAndPath', () => {
  it('combines origin and path', () => {
    expect(joinOriginAndPath('https://example.com', '/look/a')).toBe(
      'https://example.com/look/a'
    );
  });

  it('trims trailing slash on origin', () => {
    expect(joinOriginAndPath('https://example.com/', '/albums')).toBe(
      'https://example.com/albums'
    );
  });

  it('adds leading slash when missing', () => {
    expect(joinOriginAndPath('https://x.test', 'foo')).toBe('https://x.test/foo');
  });
});

describe('canonicalUrlForPath', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses window origin when available', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://app.example', pathname: '/ignored' },
    });
    expect(canonicalUrlForPath('/look/1')).toBe('https://app.example/look/1');
  });
});

describe('canonicalPageUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns origin and pathname', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://demo.dev',
        pathname: '/look/x',
      },
    });
    expect(canonicalPageUrl()).toBe('https://demo.dev/look/x');
  });
});
