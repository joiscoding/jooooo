import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './clipboard';

describe('copyTextToClipboard', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText } as Pick<Clipboard, 'writeText'>,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    writeText.mockResolvedValue(undefined);
    const ok = await copyTextToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('returns false for empty string', async () => {
    expect(await copyTextToClipboard('')).toBe(false);
  });
});
