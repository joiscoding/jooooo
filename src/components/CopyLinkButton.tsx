import type { MouseEvent } from 'react';
import { useToast } from '../context/ToastContext';
import { canonicalUrlForPath } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyText';

type CopyLinkButtonProps = {
  path: string;
  /** Shown in aria-label, e.g. look or album title */
  itemLabel: string;
  className?: string;
};

export function CopyLinkButton({
  path,
  itemLabel,
  className = 'copy-link-btn',
}: CopyLinkButtonProps) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const url = canonicalUrlForPath(path);
    const ok = await copyTextToClipboard(url);
    showToast(ok ? 'Link copied.' : 'Could not copy link.');
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={`Copy link to ${itemLabel}`}
      onClick={(e) => void handleClick(e)}
    >
      Copy link
    </button>
  );
}
