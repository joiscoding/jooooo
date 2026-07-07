import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className={`site-header${isHome ? ' site-header--transparent' : ''}`}>
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Collection
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className={`main${isHome ? ' main--home' : ''}`}>{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </p>
          <p className="footer-copy">
            Demo — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Timeless style, designed to last.
          </p>
        </div>
      </footer>
    </div>
  );
}
