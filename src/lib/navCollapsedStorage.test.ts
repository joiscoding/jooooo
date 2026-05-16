import { describe, expect, it } from 'vitest';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  collapsedFromStoredValue,
  toStoredCollapsedValue,
} from './navCollapsedStorage';

describe('navCollapsedStorage', () => {
  it('uses the agreed localStorage key', () => {
    expect(NAV_COLLAPSED_STORAGE_KEY).toBe('lookbook_nav_collapsed_v1');
  });

  it('collapsedFromStoredValue', () => {
    expect(collapsedFromStoredValue(null)).toBe(false);
    expect(collapsedFromStoredValue('0')).toBe(false);
    expect(collapsedFromStoredValue('')).toBe(false);
    expect(collapsedFromStoredValue('1')).toBe(true);
  });

  it('toStoredCollapsedValue', () => {
    expect(toStoredCollapsedValue(false)).toBe('0');
    expect(toStoredCollapsedValue(true)).toBe('1');
  });
});
