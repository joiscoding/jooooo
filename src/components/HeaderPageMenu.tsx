import { useRef } from 'react';
import { useCopyPageLink } from '../hooks/useCopyPageLink';

export function HeaderPageMenu() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const copyCurrentPageLink = useCopyPageLink();

  async function handleCopyLink() {
    await copyCurrentPageLink();
    detailsRef.current?.removeAttribute('open');
  }

  return (
    <details ref={detailsRef} className="header-menu">
      <summary
        className="header-menu-trigger"
        aria-label="Page options"
        title="Page options"
      >
        <span className="header-menu-dots" aria-hidden>
          ···
        </span>
      </summary>
      <div className="header-menu-panel">
        <button
          type="button"
          className="header-menu-item"
          onClick={() => void handleCopyLink()}
        >
          Copy link
        </button>
      </div>
    </details>
  );
}
