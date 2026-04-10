import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './copyToClipboard';

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const ok = await copyTextToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('returns false when clipboard API throws', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const ok = await copyTextToClipboard('x');
    expect(ok).toBe(false);
  });

  it('falls back to execCommand when clipboard is missing', async () => {
    vi.stubGlobal('navigator', {});
    const execCmd = vi.fn().mockReturnValue(true);
    const hadExec = 'execCommand' in document;
    const prev = hadExec
      ? Object.getOwnPropertyDescriptor(document, 'execCommand')
      : undefined;
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      writable: true,
      value: execCmd,
    });
    try {
      const ok = await copyTextToClipboard('fallback-text');
      expect(ok).toBe(true);
      expect(execCmd).toHaveBeenCalledWith('copy');
    } finally {
      if (prev) {
        Object.defineProperty(document, 'execCommand', prev);
      } else {
        Reflect.deleteProperty(document, 'execCommand');
      }
    }
  });
});
