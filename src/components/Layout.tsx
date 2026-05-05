import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { getCanonicalPageUrl } from '../lib/canonicalUrl';
import { useToast } from '../context/ToastContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const el = menuRef.current;
      if (el && !el.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  async function handleCopyPageLink() {
    const url = getCanonicalPageUrl();
    const ok = await copyTextToClipboard(url);
    setMenuOpen(false);
    if (ok) {
      showToast('Link copied.');
    } else {
      showToast('Could not copy link.');
    }
  }

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-right">
          <nav className="nav">
            <Link
              to="/"
              className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Gallery
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
          </nav>
          <div className="header-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="header-overflow-btn"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-controls="site-header-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              Menu
            </button>
            {menuOpen ? (
              <div
                id="site-header-menu"
                className="header-overflow-panel"
                role="menu"
              >
                <button
                  type="button"
                  className="header-overflow-item"
                  role="menuitem"
                  onClick={handleCopyPageLink}
                >
                  Copy link
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p>
          Demo — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Modern style, designed to last.
        </p>
      </footer>
    </div>
  );
}
