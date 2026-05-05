import type { MouseEvent } from 'react';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

type CopyLinkButtonProps = {
  url: string;
  successMessage?: string;
  /** Extra class names for the button */
  className?: string;
  label?: string;
  /** Called after successful copy */
  onCopied?: () => void;
};

export function CopyLinkButton({
  url,
  successMessage = 'Link copied.',
  className = '',
  label = 'Copy link',
  onCopied,
}: CopyLinkButtonProps) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyTextToClipboard(url);
    if (ok) {
      showToast(successMessage);
      onCopied?.();
    } else {
      showToast('Could not copy link.');
    }
  }

  return (
    <button
      type="button"
      className={`btn copy-link-btn ${className}`.trim()}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
