import { describe, it, expect, beforeEach } from 'vitest';
import {
  LOOKBOOK_NAV_COLLAPSED_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from './navCollapsedStorage';

describe('navCollapsedStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when the key is absent', () => {
    expect(readNavCollapsed()).toBe(null);
  });

  it('reads boolean strings from localStorage', () => {
    localStorage.setItem(LOOKBOOK_NAV_COLLAPSED_KEY, 'true');
    expect(readNavCollapsed()).toBe(true);
    localStorage.setItem(LOOKBOOK_NAV_COLLAPSED_KEY, 'false');
    expect(readNavCollapsed()).toBe(false);
  });

  it('returns null for unexpected values', () => {
    localStorage.setItem(LOOKBOOK_NAV_COLLAPSED_KEY, 'maybe');
    expect(readNavCollapsed()).toBe(null);
  });

  it('persists collapsed flag', () => {
    writeNavCollapsed(true);
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY)).toBe('true');
    writeNavCollapsed(false);
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY)).toBe('false');
  });
});
