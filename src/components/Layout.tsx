import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCopyLink } from '../hooks/useCopyLink';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { copyPageLink } = useCopyLink();

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(ev: MouseEvent | TouchEvent) {
      const el = menuRef.current;
      if (el && !el.contains(ev.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [menuOpen]);

  async function handleCopyCurrentPage() {
    await copyPageLink();
    setMenuOpen(false);
  }

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="site-header-right">
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
          <div className="header-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="header-menu-trigger"
              aria-label="Page actions"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              ···
            </button>
            {menuOpen ? (
              <div className="header-menu-popover" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="header-menu-item"
                  onClick={() => void handleCopyCurrentPage()}
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
