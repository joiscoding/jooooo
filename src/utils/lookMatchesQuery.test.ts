import { describe, expect, it } from 'vitest';
import type { Look } from '../types';
import { lookMatchesQuery } from './lookMatchesQuery';

const baseLook: Look = {
  id: '1',
  title: 'Quiet layers',
  tag: 'minimal',
  season: 'Spring',
  occasion: 'Weekend',
  keyItems: ['linen', 'loafers'],
  hero: 'https://example.com/h.jpg',
  gallery: [],
};

describe('lookMatchesQuery', () => {
  it('matches empty query', () => {
    expect(lookMatchesQuery(baseLook, '   ')).toBe(true);
  });

  it('matches title substring', () => {
    expect(lookMatchesQuery(baseLook, 'quiet')).toBe(true);
  });

  it('matches style label text', () => {
    expect(lookMatchesQuery(baseLook, 'minimal')).toBe(true);
  });

  it('matches key item', () => {
    expect(lookMatchesQuery(baseLook, 'loafer')).toBe(true);
  });

  it('returns false when no field matches', () => {
    expect(lookMatchesQuery(baseLook, 'nope')).toBe(false);
  });
});
