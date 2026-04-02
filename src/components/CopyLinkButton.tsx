import { useCopyPageLink } from '../hooks/useCopyPageLink';

type CopyLinkButtonProps = {
  /** Path to share (e.g. `/look/abc`). Defaults to current page. */
  path?: string;
  className?: string;
  label?: string;
  'aria-label'?: string;
};

export function CopyLinkButton({
  path,
  className = 'btn ghost copy-link-btn',
  label = 'Copy link',
  'aria-label': ariaLabel,
}: CopyLinkButtonProps) {
  const { copyCurrentPageLink, copyPathLink } = useCopyPageLink();

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        if (path) void copyPathLink(path);
        else void copyCurrentPageLink();
      }}
    >
      {label}
    </button>
  );
}
