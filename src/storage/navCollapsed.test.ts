import { afterEach, describe, expect, it } from 'vitest';
import { readNavCollapsed, writeNavCollapsed } from './navCollapsed';

describe('navCollapsed storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to expanded (false) when unset', () => {
    expect(readNavCollapsed()).toBe(false);
  });

  it('persists true and false round-trip', () => {
    writeNavCollapsed(true);
    expect(readNavCollapsed()).toBe(true);
    writeNavCollapsed(false);
    expect(readNavCollapsed()).toBe(false);
  });

  it('treats invalid values as expanded', () => {
    localStorage.setItem('lookbook_nav_collapsed_v1', 'maybe');
    expect(readNavCollapsed()).toBe(false);
  });
});
