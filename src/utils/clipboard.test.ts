import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const ok = await copyToClipboard('https://example.com/look/1');

    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('https://example.com/look/1');
  });

  it('returns false for empty text', async () => {
    const ok = await copyToClipboard('');
    expect(ok).toBe(false);
  });

  it('falls back to execCommand when clipboard API fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
    });

    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    const ok = await copyToClipboard('https://example.com/albums/1');

    expect(ok).toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});
