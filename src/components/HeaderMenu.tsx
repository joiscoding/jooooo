import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopyLink } from '../hooks/useCopyLink';

export function HeaderMenu() {
  const { pathname } = useLocation();
  const { copyLink } = useCopyLink();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  async function handleCopyLink() {
    setOpen(false);
    await copyLink(pathname);
  }

  return (
    <div className="header-menu" ref={menuRef}>
      <button
        type="button"
        className="header-menu-trigger"
        aria-label="Page actions"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        ⋯
      </button>
      {open && (
        <div className="header-menu-panel" role="menu">
          <button
            type="button"
            className="header-menu-item"
            role="menuitem"
            onClick={() => void handleCopyLink()}
          >
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
