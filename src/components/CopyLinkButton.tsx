import type { MouseEvent } from 'react';
import { useCopyLink } from '../hooks/useCopyLink';

type CopyLinkButtonProps = {
  /** Path to copy (e.g. `/look/abc`). Defaults to current page. */
  pathname: string;
  className?: string;
  label?: string;
  stopNavigation?: boolean;
};

export function CopyLinkButton({
  pathname,
  className = 'btn copy-link-inline',
  label = 'Copy link',
  stopNavigation = false,
}: CopyLinkButtonProps) {
  const { copyPageLink } = useCopyLink();

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (stopNavigation) {
      e.preventDefault();
      e.stopPropagation();
    }
    await copyPageLink(pathname);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
}
