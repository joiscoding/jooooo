import { useState, type MouseEvent } from 'react';
import { copyToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

type CopyLinkButtonProps = {
  url: string;
  label?: string;
  className?: string;
  /** Stop propagation so parent links do not navigate */
  stopPropagation?: boolean;
};

export function CopyLinkButton({
  url,
  label = 'Copy link',
  className = 'btn copy-link-btn',
  stopPropagation = true,
}: CopyLinkButtonProps) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) e.stopPropagation();
    if (busy || !url) return;
    setBusy(true);
    try {
      await copyToClipboard(url);
      showToast('Link copied.');
    } catch {
      showToast('Could not copy link.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={busy || !url}
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
}
