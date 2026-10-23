import { describe, expect, it } from 'vitest';
import { filterLooksByQuery } from './filterLooksByQuery';
import type { Look } from '../types';

const sampleLook: Look = {
  id: '1',
  title: 'Quiet Layering',
  tag: 'minimal',
  season: 'Spring',
  occasion: 'Weekend',
  keyItems: ['linen shirt', 'chinos'],
  hero: 'https://example.com/1.jpg',
  gallery: [],
};

describe('filterLooksByQuery', () => {
  it('returns all looks when query is empty', () => {
    expect(filterLooksByQuery([sampleLook], '')).toEqual([sampleLook]);
    expect(filterLooksByQuery([sampleLook], '   ')).toEqual([sampleLook]);
  });

  it('filters by title', () => {
    expect(filterLooksByQuery([sampleLook], 'quiet')).toEqual([sampleLook]);
    expect(filterLooksByQuery([sampleLook], 'nope')).toEqual([]);
  });

  it('filters by key items', () => {
    expect(filterLooksByQuery([sampleLook], 'linen')).toEqual([sampleLook]);
  });
});
