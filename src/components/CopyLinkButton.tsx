import { useCallback, type MouseEvent } from 'react';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { canonicalUrlFromPath } from '../lib/canonicalUrl';
import { useToast } from '../context/ToastContext';

type Props = {
  pathname: string;
  label?: string;
  className?: string;
  title?: string;
};

export function CopyLinkButton({
  pathname,
  label = 'Copy link',
  className = 'btn copy-link-btn',
  title: titleAttr,
}: Props) {
  const { showToast } = useToast();

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const url = canonicalUrlFromPath(pathname);
      const ok = await copyTextToClipboard(url);
      showToast(ok ? 'Link copied to clipboard.' : 'Could not copy link.');
    },
    [pathname, showToast]
  );

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      title={titleAttr ?? `Copy link: ${canonicalUrlFromPath(pathname)}`}
    >
      {label}
    </button>
  );
}
