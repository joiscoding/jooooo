import { useCallback, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { buildCanonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';

type CopyLinkButtonProps = {
  /** Full canonical URL to copy; defaults to current page (origin + pathname). */
  url?: string;
  label?: string;
  className?: string;
};

export function CopyLinkButton({
  url,
  label = 'Copy link',
  className = 'btn copy-link-btn',
}: CopyLinkButtonProps) {
  const location = useLocation();
  const { showToast } = useToast();

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const href =
        url ??
        buildCanonicalPageUrl({
          origin: window.location.origin,
          pathname: location.pathname,
        });
      const ok = await copyTextToClipboard(href);
      showToast(ok ? 'Link copied.' : 'Could not copy link.');
    },
    [url, location.pathname, showToast]
  );

  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
}
