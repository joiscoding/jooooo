import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { getCanonicalUrlForPath } from '../lib/canonicalUrl';

export function HeaderShareMenu() {
  const { pathname } = useLocation();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocPointerDown(ev: MouseEvent) {
      if (!wrapRef.current?.contains(ev.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocPointerDown);
    return () => document.removeEventListener('mousedown', onDocPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  async function handleCopyPageLink() {
    const url = getCanonicalUrlForPath(pathname);
    const ok = await copyTextToClipboard(url);
    showToast(ok ? 'Link copied' : 'Could not copy link');
    setOpen(false);
  }

  return (
    <div className="header-menu-wrap" ref={wrapRef}>
      <button
        type="button"
        className="header-menu-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Page actions"
        onClick={() => setOpen((v) => !v)}
      >
        ⋯
      </button>
      {open ? (
        <div className="header-menu-dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            className="header-menu-item"
            onClick={() => void handleCopyPageLink()}
          >
            Copy link
          </button>
        </div>
      ) : null}
    </div>
  );
}
