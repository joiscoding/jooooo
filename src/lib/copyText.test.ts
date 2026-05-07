import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { copyTextToClipboard } from './copyText';

describe('copyTextToClipboard', () => {
  let execCommandMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    execCommandMock = vi.fn();
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      writable: true,
      value: execCommandMock,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    // @ts-expect-error restore
    delete document.execCommand;
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const ok = await copyTextToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(execCommandMock).not.toHaveBeenCalled();
  });

  it('returns false when clipboard throws and execCommand returns false', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    execCommandMock.mockReturnValue(false);

    const ok = await copyTextToClipboard('x');
    expect(ok).toBe(false);
  });

  it('falls back to execCommand when clipboard API is missing', async () => {
    // @ts-expect-error strip clipboard
    vi.stubGlobal('navigator', { clipboard: undefined });
    execCommandMock.mockReturnValue(true);

    const ok = await copyTextToClipboard('fallback text');
    expect(ok).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });
});
