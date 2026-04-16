import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './copyToClipboard';

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns true when clipboard API succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await expect(copyTextToClipboard('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard throws', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
    });
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    });
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    await expect(copyTextToClipboard('fallback')).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('returns false when execCommand returns false', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined });
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn(() => false),
      configurable: true,
    });

    await expect(copyTextToClipboard('x')).resolves.toBe(false);
  });
});
