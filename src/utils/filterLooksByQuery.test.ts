import { describe, expect, it } from 'vitest';
import type { Look } from '../types';
import { filterLooksByQuery } from './filterLooksByQuery';

const sample: Look[] = [
  {
    id: '1',
    title: 'Quiet linen',
    tag: 'minimal',
    season: 'Spring',
    occasion: 'Weekend',
    keyItems: ['Linen shirt', 'Trousers'],
    hero: '/a.jpg',
    gallery: [],
  },
  {
    id: '2',
    title: 'City layers',
    tag: 'streetwear',
    season: 'Fall',
    occasion: 'Travel',
    keyItems: ['Shell jacket'],
    hero: '/b.jpg',
    gallery: [],
  },
];

describe('filterLooksByQuery', () => {
  it('returns all looks for empty query', () => {
    expect(filterLooksByQuery(sample, '   ')).toEqual(sample);
  });

  it('filters by title substring (case-insensitive)', () => {
    expect(filterLooksByQuery(sample, 'city')).toEqual([sample[1]]);
  });

  it('filters by style label text', () => {
    const minimal = filterLooksByQuery(sample, 'minimal');
    expect(minimal).toHaveLength(1);
    expect(minimal[0]!.id).toBe('1');
  });

  it('filters by key item', () => {
    expect(filterLooksByQuery(sample, 'linen')).toEqual([sample[0]]);
  });
});
