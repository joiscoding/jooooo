import type { MouseEvent } from 'react';
import { copyTextToClipboard } from '../lib/clipboard';
import { useToast } from '../context/ToastContext';

type CopyLinkButtonProps = {
  url: string;
  className?: string;
  'aria-label'?: string;
  size?: 'sm' | 'md';
  variant?: 'on-dark' | 'on-light';
};

const SUCCESS = 'Link copied.';

export function CopyLinkButton({
  url,
  className = '',
  'aria-label': ariaLabel = 'Copy link',
  size = 'sm',
  variant = 'on-light',
}: CopyLinkButtonProps) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyTextToClipboard(url);
    if (ok) {
      showToast(SUCCESS);
    } else {
      showToast('Could not copy. Try again.');
    }
  }

  const sizeClass = size === 'md' ? 'copy-link-btn-md' : 'copy-link-btn';
  const variantClass =
    variant === 'on-dark' ? ' copy-link-on-dark' : ' copy-link-on-light';

  return (
    <button
      type="button"
      className={`${sizeClass}${variantClass} ${className}`.trim()}
      onClick={handleClick}
      aria-label={ariaLabel}
      title="Copy link"
    >
      Copy link
    </button>
  );
}
