import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buildCanonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { useToast } from '../context/ToastContext';

export function HeaderPageMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (wrapRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function copyCurrentPage() {
    const url = buildCanonicalPageUrl(window.location.origin, pathname);
    try {
      await copyTextToClipboard(url);
      showToast('Link copied.');
    } catch {
      showToast('Could not copy link.');
    }
    setOpen(false);
  }

  return (
    <div className="header-menu-wrap" ref={wrapRef}>
      <button
        type="button"
        className="header-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="header-page-menu"
        id="header-page-menu-button"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="header-menu-trigger-dots" aria-hidden>
          ···
        </span>
        <span className="sr-only">Page actions</span>
      </button>
      {open ? (
        <div
          className="header-menu"
          id="header-page-menu"
          role="menu"
          aria-labelledby="header-page-menu-button"
        >
          <button
            type="button"
            className="header-menu-item"
            role="menuitem"
            onClick={copyCurrentPage}
          >
            Copy page link
          </button>
        </div>
      ) : null}
    </div>
  );
}
