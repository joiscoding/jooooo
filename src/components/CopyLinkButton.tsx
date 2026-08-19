import type { MouseEvent } from 'react';
import { useCopyLink } from '../hooks/useCopyLink';

type CopyLinkButtonProps = {
  pathname: string;
  label?: string;
  className?: string;
};

export function CopyLinkButton({
  pathname,
  label = 'Copy link',
  className = 'btn copy-link-btn',
}: CopyLinkButtonProps) {
  const { copyLink } = useCopyLink();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    void copyLink(pathname);
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
}
