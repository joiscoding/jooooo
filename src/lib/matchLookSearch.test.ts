import { describe, expect, it } from 'vitest';
import type { Look } from '../types';
import { matchLookSearch } from './matchLookSearch';

const sample: Look = {
  id: '1',
  title: 'Quiet Linen Suit',
  tag: 'minimal',
  season: 'Spring',
  occasion: 'Gallery opening',
  keyItems: ['Linen blazer', 'White tee'],
  hero: '/x.jpg',
  gallery: [],
};

describe('matchLookSearch', () => {
  it('matches empty query', () => {
    expect(matchLookSearch(sample, '')).toBe(true);
    expect(matchLookSearch(sample, '   ')).toBe(true);
  });

  it('matches title substring', () => {
    expect(matchLookSearch(sample, 'linen')).toBe(true);
  });

  it('matches style label', () => {
    expect(matchLookSearch(sample, 'quiet')).toBe(true);
  });

  it('requires all tokens', () => {
    expect(matchLookSearch(sample, 'linen spring')).toBe(true);
    expect(matchLookSearch(sample, 'linen nomatch')).toBe(false);
  });
});
