import { describe, expect, it } from 'vitest';
import type { Look } from '../types';
import { matchLookSearch } from './matchLookSearch';

const sampleLook: Look = {
  id: 'test-look',
  title: 'Crosswalk Khaki',
  tag: 'streetwear',
  season: 'Transitional',
  occasion: 'Downtown',
  keyItems: ['Boxy overshirt', 'Relaxed chino'],
  hero: '/looks/test.jpg',
  gallery: ['/looks/test.jpg'],
};

describe('matchLookSearch', () => {
  it('matches empty query to all looks', () => {
    expect(matchLookSearch(sampleLook, '')).toBe(true);
    expect(matchLookSearch(sampleLook, '   ')).toBe(true);
  });

  it('matches title substring', () => {
    expect(matchLookSearch(sampleLook, 'crosswalk')).toBe(true);
    expect(matchLookSearch(sampleLook, 'KHAKI')).toBe(true);
  });

  it('matches tag label and key items', () => {
    expect(matchLookSearch(sampleLook, 'streetwear')).toBe(true);
    expect(matchLookSearch(sampleLook, 'overshirt')).toBe(true);
  });

  it('returns false when no match', () => {
    expect(matchLookSearch(sampleLook, 'minimal')).toBe(false);
  });
});
