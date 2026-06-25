import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Studio Lookbook
          </Link>
          <nav className="nav" aria-label="Main">
            <Link
              to="/"
              className={isHome ? 'nav-link active' : 'nav-link'}
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
          <div className="header-actions">
            <Link to="/albums" className="btn btn-ghost btn-sm">
              My albums
            </Link>
            <a href="#gallery" className="btn btn-primary btn-sm">
              Browse looks
            </a>
          </div>
        </div>
      </header>
      <main className={isHome ? 'main main--landing' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">Studio Lookbook</p>
          <p className="footer-copy">
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
        </div>
      </footer>
    </div>
  );
}
