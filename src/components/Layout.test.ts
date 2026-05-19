import { describe, expect, it } from 'vitest';
import { parseNavCollapsed } from './Layout';

describe('parseNavCollapsed', () => {
  it('returns false for null and unknown values', () => {
    expect(parseNavCollapsed(null)).toBe(false);
    expect(parseNavCollapsed('')).toBe(false);
    expect(parseNavCollapsed('yes')).toBe(false);
  });

  it('parses true and false strings', () => {
    expect(parseNavCollapsed('true')).toBe(true);
    expect(parseNavCollapsed('false')).toBe(false);
  });
});
