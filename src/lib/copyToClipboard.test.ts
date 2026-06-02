import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './copyToClipboard';

describe('copyToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await expect(copyToClipboard('https://example.com/look/1')).resolves.toBe(
      true,
    );
    expect(writeText).toHaveBeenCalledWith('https://example.com/look/1');
  });

  it('returns false for empty text', async () => {
    await expect(copyToClipboard('')).resolves.toBe(false);
  });

  it('returns false when clipboard is unavailable', async () => {
    vi.stubGlobal('navigator', {});
    await expect(copyToClipboard('https://example.com')).resolves.toBe(false);
  });
});
