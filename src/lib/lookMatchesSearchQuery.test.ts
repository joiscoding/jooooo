import { describe, expect, it } from 'vitest';
import { lookMatchesSearchQuery } from './lookMatchesSearchQuery';
import type { Look } from '../types';

const baseLook: Look = {
  id: '1',
  title: 'Quiet navy layers',
  tag: 'minimal',
  season: 'Fall',
  occasion: 'Weekend',
  keyItems: ['wool coat', 'denim'],
  hero: '',
  gallery: [],
};

describe('lookMatchesSearchQuery', () => {
  it('matches title substring', () => {
    expect(lookMatchesSearchQuery(baseLook, 'navy')).toBe(true);
    expect(lookMatchesSearchQuery(baseLook, 'QUIET')).toBe(true);
  });

  it('matches style label text', () => {
    expect(lookMatchesSearchQuery(baseLook, 'minimal')).toBe(true);
  });

  it('matches key items', () => {
    expect(lookMatchesSearchQuery(baseLook, 'denim')).toBe(true);
  });

  it('returns true for whitespace-only query', () => {
    expect(lookMatchesSearchQuery(baseLook, '  \t')).toBe(true);
  });

  it('returns false when no field matches', () => {
    expect(lookMatchesSearchQuery(baseLook, 'leather')).toBe(false);
  });
});
