import type { MouseEvent } from 'react';
import { useToast } from '../context/ToastContext';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { getCanonicalUrlForPath } from '../lib/canonicalUrl';

type CopyLinkButtonProps = {
  /** Path only (e.g. `/look/foo`), excluding origin — canonical URL is built at click time. */
  path: string;
  /** Accessible label for compact controls (especially overlay chips). */
  label?: string;
  className?: string;
  /** Smaller control; pair with `overlay` for floating card actions. */
  compact?: boolean;
  /** Absolutely positioned chip on gallery / album image cards. */
  overlay?: boolean;
};

export function CopyLinkButton({
  path,
  label = 'Copy link',
  className = '',
  compact = false,
  overlay = false,
}: CopyLinkButtonProps) {
  const { showToast } = useToast();

  async function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = getCanonicalUrlForPath(path);
    const ok = await copyTextToClipboard(url);
    showToast(ok ? 'Link copied' : 'Could not copy link');
  }

  const btnClass = [
    compact ? 'btn-copy-link-compact' : 'btn-copy-link',
    compact && overlay ? 'btn-copy-link-overlay' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showCompactText = compact;

  return (
    <button
      type="button"
      className={btnClass}
      onClick={handleClick}
      aria-label={compact && overlay ? label : undefined}
    >
      {showCompactText ? (
        <span className="btn-copy-link-compact-text">Copy link</span>
      ) : (
        label
      )}
    </button>
  );
}
