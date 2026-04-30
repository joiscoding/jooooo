import type { MouseEvent, ReactNode } from 'react';
import { useToast } from '../context/ToastContext';
import { canonicalPageUrl } from '../lib/canonicalUrl';
import { copyToClipboard } from '../lib/copyToClipboard';

type CopyLinkButtonProps = {
  targetPath: string;
  className?: string;
  'aria-label'?: string;
  children?: ReactNode;
};

export function CopyLinkButton({
  targetPath,
  className,
  'aria-label': ariaLabel = 'Copy link to this page',
  children,
}: CopyLinkButtonProps) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const url = canonicalPageUrl(targetPath);
    const ok = await copyToClipboard(url);
    showToast(ok ? 'Link copied to clipboard.' : 'Could not copy link.');
    const menu = e.currentTarget.closest('details');
    if (menu) menu.removeAttribute('open');
  }

  return (
    <button
      type="button"
      className={className ?? 'btn ghost copy-link-btn'}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children ?? 'Copy link'}
    </button>
  );
}
