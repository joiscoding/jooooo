import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className={isHome ? 'layout layout--home' : 'layout'}>
      <header className="site-header">
        <nav className="nav nav--left" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Gallery
          </Link>
        </nav>
        <Link to="/" className="logo" aria-label="Studio home">
          <span className="logo-mark">Studio</span>
        </Link>
        <nav className="nav nav--right" aria-label="Secondary">
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p className="footer-mark">Studio</p>
        <p>
          Demo - photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
