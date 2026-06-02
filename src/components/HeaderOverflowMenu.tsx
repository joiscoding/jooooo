import { useEffect, useId, useRef, useState } from 'react';
import { useCopyLink } from '../hooks/useCopyLink';

export function HeaderOverflowMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const { copyCurrentPageLink } = useCopyLink();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleCopyLink() {
    setOpen(false);
    await copyCurrentPageLink();
  }

  return (
    <div className="header-overflow" ref={rootRef}>
      <button
        type="button"
        className="header-overflow-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Page actions</span>
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <div
          id={menuId}
          className="header-overflow-menu"
          role="menu"
          aria-label="Page actions"
        >
          <button
            type="button"
            role="menuitem"
            className="header-overflow-item"
            onClick={handleCopyLink}
          >
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
