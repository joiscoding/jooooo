import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './copyToClipboard';

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await copyTextToClipboard('hello');

    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard API is missing', async () => {
    vi.stubGlobal('navigator', {} as Navigator);
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    });

    await copyTextToClipboard('fallback');

    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});
