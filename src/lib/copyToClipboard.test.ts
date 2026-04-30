import { describe, expect, it, vi, afterEach } from 'vitest';
import { copyToClipboard } from './copyToClipboard';

describe('copyToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns true when Clipboard API succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    } as Navigator);

    const ok = await copyToClipboard('https://example.com/foo');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('https://example.com/foo');
  });

  it('falls back to execCommand when clipboard throws', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
    } as Navigator);

    const execMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      value: execMock,
      configurable: true,
      writable: true,
    });

    const ok = await copyToClipboard('hello');
    expect(ok).toBe(true);
    expect(execMock).toHaveBeenCalledWith('copy');

    Reflect.deleteProperty(document, 'execCommand');
  });
});
