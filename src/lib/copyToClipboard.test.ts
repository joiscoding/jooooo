import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { copyTextToClipboard } from './copyToClipboard';

describe('copyTextToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('uses Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const ok = await copyTextToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
    });
    const execCommandMock = vi.fn(() => true);
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      configurable: true,
    });

    const ok = await copyTextToClipboard('fallback');
    expect(ok).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });
});
