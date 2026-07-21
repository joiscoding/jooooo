import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo" aria-label="Studio home">
          <span className="logo-mark">Studio</span>
        </Link>
        <nav className="nav" aria-label="Primary">
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
        <Link to="/albums" className="header-cta">
          Save looks
        </Link>
      </header>
      <main className={isHome ? 'main main-home' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">Studio</p>
          <p className="footer-note">
            Demo lookbook — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
