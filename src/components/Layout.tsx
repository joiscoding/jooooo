import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <nav className="nav nav-left">
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
        <Link to="/" className="logo" aria-label="Polo Studio home">
          <span className="logo-crest" aria-hidden="true">⚜</span>
          <span className="logo-serif">Polo Studio</span>
          <span className="logo-sans">Heritage · Est. 1989</span>
        </Link>
        <div className="nav nav-right" aria-hidden="true">
          <span className="nav-link">Menswear</span>
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
. Timeless style, crafted to endure.
        </p>
      </footer>
    </div>
  );
}
