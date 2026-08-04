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

    await copyTextToClipboard('hello');

    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard API is missing', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined });
    const textarea = {
      value: '',
      setAttribute: vi.fn(),
      style: {} as CSSStyleDeclaration,
      select: vi.fn(),
    };
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const execCommand = vi.fn().mockReturnValue(true);
    vi.stubGlobal(
      'document',
      {
        createElement: vi.fn(() => textarea),
        body: { appendChild, removeChild },
        execCommand,
      } as unknown as Document,
    );

    await copyTextToClipboard('fallback');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(appendChild).toHaveBeenCalledWith(textarea);
    expect(removeChild).toHaveBeenCalledWith(textarea);
  });
});
