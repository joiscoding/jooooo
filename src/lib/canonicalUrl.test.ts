import { afterEach, describe, expect, it, vi } from 'vitest';
import { canonicalUrlFromPath } from './canonicalUrl';

describe('canonicalUrlFromPath', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('combines window origin with pathname', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://example.com' },
    });
    expect(canonicalUrlFromPath('/look/abc')).toBe(
      'https://example.com/look/abc'
    );
  });

  it('normalizes pathname without leading slash', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://app.test' },
    });
    expect(canonicalUrlFromPath('albums/x')).toBe('https://app.test/albums/x');
  });

  it('returns path only when window is undefined', () => {
    const orig = globalThis.window;
    // @ts-expect-error test SSR-ish branch
    delete globalThis.window;
    expect(canonicalUrlFromPath('/foo')).toBe('/foo');
    globalThis.window = orig;
  });
});
