import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './copyToClipboard';

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    });

    const ok = await copyTextToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back when clipboard API throws', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    // jsdom has no execCommand; stub for fallback path
    vi.stubGlobal(
      'document',
      new Proxy(document, {
        get(target, prop, receiver) {
          if (prop === 'execCommand') return execCommand;
          return Reflect.get(target, prop, receiver);
        },
      }),
    );
    const append = vi.spyOn(document.body, 'appendChild');
    const remove = vi.spyOn(document.body, 'removeChild');

    const ok = await copyTextToClipboard('fallback');
    expect(ok).toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(append).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });
});
