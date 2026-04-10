import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { copyTextToClipboard } from '../lib/copyToClipboard';
import { canonicalUrlFromPath } from '../lib/canonicalUrl';
import { useToast } from '../context/ToastContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!menuOpen) return;
    function onDocMouseDown(ev: globalThis.MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(ev.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [menuOpen]);

  const copyCurrentPageLink = useCallback(async () => {
    const url = canonicalUrlFromPath(pathname);
    const ok = await copyTextToClipboard(url);
    showToast(ok ? 'Link copied to clipboard.' : 'Could not copy link.');
    setMenuOpen(false);
  }, [pathname, showToast]);

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
              className="header-menu-trigger"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="Page options"
              onClick={() => setMenuOpen((o) => !o)}
            >
              ⋯
            </button>
            {menuOpen ? (
              <div className="header-menu-dropdown" role="menu">
                <button
                  type="button"
                  className="header-menu-item"
                  role="menuitem"
                  onClick={copyCurrentPageLink}
                >
                  Copy link to this page
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
