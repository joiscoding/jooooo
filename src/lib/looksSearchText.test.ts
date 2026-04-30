import { describe, expect, it } from 'vitest';
import { looksSearchText } from './looksSearchText';
import type { Look } from '../types';

const sampleLook: Look = {
  id: '1',
  title: 'Quiet Linen Suit',
  tag: 'classic',
  season: 'Spring',
  occasion: 'Office',
  keyItems: ['Blazer', 'Trousers'],
  hero: 'https://example.com/h.jpg',
  gallery: [],
};

describe('looksSearchText', () => {
  it('includes title, tag label, season, occasion, and key items lowercased', () => {
    const t = looksSearchText(sampleLook);
    expect(t).toContain('quiet linen suit');
    expect(t).toContain('classic / tailored');
    expect(t).toContain('spring');
    expect(t).toContain('office');
    expect(t).toContain('blazer');
    expect(t).toContain('trousers');
  });
});
