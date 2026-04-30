import { describe, expect, it } from 'vitest';
import { isTypingSurface } from './isTypingSurface';

describe('isTypingSurface', () => {
  it('returns false for null', () => {
    expect(isTypingSurface(null)).toBe(false);
  });

  it('returns true for text input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    expect(isTypingSurface(input)).toBe(true);
  });

  it('returns false for button input', () => {
    const input = document.createElement('input');
    input.type = 'button';
    expect(isTypingSurface(input)).toBe(false);
  });

  it('returns true when focus is inside contenteditable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    const inner = document.createElement('span');
    div.appendChild(inner);
    expect(isTypingSurface(inner)).toBe(true);
  });
});
