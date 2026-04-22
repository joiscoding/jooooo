import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { buildCanonicalUrl } from '../lib/canonicalUrl';
import { copyTextToClipboard } from '../lib/clipboard';
import { useToast } from '../context/ToastContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== 'undefined'
      ? buildCanonicalUrl(window.location.origin, pathname)
      : '';

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  async function handleHeaderCopy() {
    if (!shareUrl) return;
    const ok = await copyTextToClipboard(shareUrl);
    if (ok) {
      showToast('Link copied.');
      setMenuOpen(false);
    } else {
      showToast('Could not copy. Try again.');
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
          <div className="header-menu-wrap" ref={wrapRef}>
            <button
              type="button"
              className="header-menu-trigger"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Page options"
              onClick={() => setMenuOpen((o) => !o)}
            >
              ···
            </button>
            {menuOpen && (
              <ul className="header-menu" role="menu">
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="header-menu-item"
                    onClick={() => {
                      void handleHeaderCopy();
                    }}
                  >
                    Copy page link
                  </button>
                </li>
              </ul>
            )}
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
