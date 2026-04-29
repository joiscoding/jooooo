import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useCopyLink } from '../hooks/useCopyLink';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const copyPageLink = useCopyLink();

  useEffect(() => {
    menuRef.current?.removeAttribute('open');
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnOutside(e: MouseEvent) {
      const el = menuRef.current;
      if (el && !el.contains(e.target as Node)) {
        el.removeAttribute('open');
        setMenuOpen(false);
      }
    }
    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuRef.current?.open) {
        menuRef.current.removeAttribute('open');
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  async function handleCopyPageLink() {
    await copyPageLink(pathname);
    menuRef.current?.removeAttribute('open');
    setMenuOpen(false);
  }

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-actions">
          <nav className="nav" aria-label="Primary">
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
          <details
            ref={menuRef}
            className="header-menu"
            onToggle={(e) =>
              setMenuOpen((e.target as HTMLDetailsElement).open)
            }
          >
            <summary
              className="header-menu-trigger"
              aria-label="Page options"
            >
              <span aria-hidden>⋯</span>
            </summary>
            <div className="header-menu-panel" role="menu">
              <button
                type="button"
                className="header-menu-item"
                role="menuitem"
                onClick={() => void handleCopyPageLink()}
              >
                Copy page link
              </button>
            </div>
          </details>
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
