import { useRef } from 'react';
import { useCopyPageLink } from '../hooks/useCopyPageLink';

export function SiteHeaderMenu() {
  const { copyCurrentPageLink } = useCopyPageLink();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={detailsRef} className="header-menu">
      <summary className="header-menu-trigger" aria-label="Page menu">
        <span className="header-menu-dots" aria-hidden>
          ···
        </span>
      </summary>
      <div className="header-menu-panel" role="menu">
        <button
          type="button"
          className="header-menu-item"
          role="menuitem"
          onClick={() => {
            void copyCurrentPageLink();
            if (detailsRef.current) detailsRef.current.open = false;
          }}
        >
          Copy link
        </button>
      </div>
    </details>
  );
}
