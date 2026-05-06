import type { MouseEvent } from 'react';
import { canonicalPageUrl, canonicalUrlForPath } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

type Props = {
  /** Path to share (e.g. `/look/x`). Defaults to current page when omitted. */
  path?: string;
  className?: string;
  label?: string;
  /** Stop navigation when nested inside a link */
  stopPropagation?: boolean;
  onCopied?: (success: boolean) => void;
};

export function CopyLinkButton({
  path,
  className = 'btn-copy-link',
  label = 'Copy link',
  stopPropagation = false,
  onCopied,
}: Props) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    const url = path ? canonicalUrlForPath(path) : canonicalPageUrl();
    const ok = await copyTextToClipboard(url);
    showToast(ok ? 'Link copied.' : 'Could not copy link.', ok ? 2400 : 3200);
    onCopied?.(ok);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
}
