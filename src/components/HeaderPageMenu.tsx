import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { buildCanonicalPageUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/copyToClipboard';

export function HeaderPageMenu() {
  const location = useLocation();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: Event) {
      const el = wrapRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  async function handleCopyPageLink() {
    const href = buildCanonicalPageUrl({
      origin: window.location.origin,
      pathname: location.pathname,
    });
    const ok = await copyTextToClipboard(href);
    showToast(ok ? 'Link copied.' : 'Could not copy link.');
    setOpen(false);
  }

  return (
    <div className="header-page-menu" ref={wrapRef}>
      <button
        type="button"
        className="header-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        Page
        <span className="header-menu-chevron" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div id={menuId} className="header-menu-dropdown" role="menu">
          <button
            type="button"
            className="header-menu-item"
            role="menuitem"
            onClick={() => void handleCopyPageLink()}
          >
            Copy link
          </button>
        </div>
      ) : null}
    </div>
  );
}
