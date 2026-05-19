import type { MouseEvent, ReactNode } from 'react';
import { buildCanonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

type CopyLinkButtonProps = {
  path: string;
  /** Accessible name, e.g. "Copy link to Crosswalk Khaki" */
  ariaLabel: string;
  className?: string;
  children?: ReactNode;
};

export function CopyLinkButton({
  path,
  ariaLabel,
  className,
  children = 'Copy link',
}: CopyLinkButtonProps) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const url = buildCanonicalPageUrl(window.location.origin, path);
    try {
      await copyTextToClipboard(url);
      showToast('Link copied.');
    } catch {
      showToast('Could not copy link.');
    }
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
