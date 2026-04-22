import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyColorSchemeToDocument,
  getResolvedColorScheme,
  parseStoredTheme,
  readStoredTheme,
  writeStoredTheme,
} from './theme';

describe('parseStoredTheme', () => {
  it('returns system for null or invalid', () => {
    expect(parseStoredTheme(null)).toBe('system');
    expect(parseStoredTheme('foo')).toBe('system');
  });

  it('accepts valid values', () => {
    expect(parseStoredTheme('light')).toBe('light');
    expect(parseStoredTheme('dark')).toBe('dark');
    expect(parseStoredTheme('system')).toBe('system');
  });
});

describe('getResolvedColorScheme', () => {
  it('maps light and dark', () => {
    expect(getResolvedColorScheme('light', true)).toBe('light');
    expect(getResolvedColorScheme('light', false)).toBe('light');
    expect(getResolvedColorScheme('dark', true)).toBe('dark');
    expect(getResolvedColorScheme('dark', false)).toBe('dark');
  });

  it('uses prefersDark for system', () => {
    expect(getResolvedColorScheme('system', true)).toBe('dark');
    expect(getResolvedColorScheme('system', false)).toBe('light');
  });
});

describe('read/writeStoredTheme & applyColorSchemeToDocument', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-scheme');
    document.documentElement.style.removeProperty('color-scheme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('readStoredTheme returns system when key missing', () => {
    expect(readStoredTheme()).toBe('system');
  });

  it('round-trips through localStorage', () => {
    writeStoredTheme('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(readStoredTheme()).toBe('dark');
  });

  it('applyColorSchemeToDocument sets data attribute and color-scheme', () => {
    applyColorSchemeToDocument('dark');
    expect(document.documentElement.dataset.colorScheme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
