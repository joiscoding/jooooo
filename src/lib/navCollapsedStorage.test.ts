import { describe, expect, it, beforeEach } from 'vitest';
import {
  LOOKBOOK_NAV_COLLAPSED_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navCollapsedStorage';

describe('navCollapsedStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false when unset', () => {
    expect(readNavCollapsed()).toBe(false);
  });

  it('round-trips true', () => {
    writeNavCollapsed(true);
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY)).toBe('true');
    expect(readNavCollapsed()).toBe(true);
  });

  it('round-trips false', () => {
    writeNavCollapsed(true);
    writeNavCollapsed(false);
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY)).toBe('false');
    expect(readNavCollapsed()).toBe(false);
  });
});
