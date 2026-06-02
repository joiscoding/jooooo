import type { MouseEvent } from 'react';

type CopyLinkButtonProps = {
  onCopy: () => void | Promise<void>;
  label?: string;
  className?: string;
};

export function CopyLinkButton({
  onCopy,
  label = 'Copy link',
  className = 'btn copy-link-btn',
}: CopyLinkButtonProps) {
  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    await onCopy();
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <span className="copy-link-icon" aria-hidden="true">
        ⧉
      </span>
      <span className="copy-link-label">{label}</span>
    </button>
  );
}
