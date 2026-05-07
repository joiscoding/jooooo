import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  canonicalCurrentPageUrl,
  canonicalUrlForPath,
  canonicalUrlFromParts,
} from './canonicalUrl';

describe('canonicalUrlFromParts', () => {
  it('joins origin and pathname', () => {
    expect(canonicalUrlFromParts('https://ex.com', '/look/a')).toBe(
      'https://ex.com/look/a',
    );
  });

  it('strips trailing slash from origin', () => {
    expect(canonicalUrlFromParts('https://ex.com/', '/albums')).toBe(
      'https://ex.com/albums',
    );
  });

  it('prefixes pathname when missing slash', () => {
    expect(canonicalUrlFromParts('https://ex.com', 'look/a')).toBe(
      'https://ex.com/look/a',
    );
  });
});

describe('canonicalUrlForPath', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses current origin and normalizes path', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://app.example' },
    });
    expect(canonicalUrlForPath('/look/x')).toBe('https://app.example/look/x');
    expect(canonicalUrlForPath('albums')).toBe('https://app.example/albums');
  });
});

describe('canonicalCurrentPageUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns origin plus pathname only', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://demo.local:5173',
        pathname: '/look/abc',
      },
    });
    expect(canonicalCurrentPageUrl()).toBe('https://demo.local:5173/look/abc');
  });
});
