import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <nav className="nav nav--left" aria-label="Primary left">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Lookbook
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
        <Link to="/" className="logo logo--wordmark">
          studio lookbook
        </Link>
        <div className="nav nav--right" aria-hidden>
          <span className="nav-link nav-link--muted">Men</span>
        </div>
      </header>
      <main className={isHome ? 'main main--flush' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="site-footer__grid">
          <p className="site-footer__brand">studio lookbook</p>
          <p className="site-footer__legal">
            Demo — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Athletic luxury, designed to move.
          </p>
        </div>
      </footer>
    </div>
  );
}
