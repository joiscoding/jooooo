import { describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './copyToClipboard';

describe('copyTextToClipboard', () => {
  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    });

    await expect(copyTextToClipboard('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');

    vi.unstubAllGlobals();
  });

  it('falls back to execCommand when clipboard API is missing', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined });

    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
      writable: true,
    });

    await expect(copyTextToClipboard('fallback')).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');

    Reflect.deleteProperty(document, 'execCommand');
    vi.unstubAllGlobals();
  });
});
