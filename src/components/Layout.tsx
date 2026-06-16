import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-crest" aria-hidden="true">
            RL
          </span>
          <span className="logo-wordmark">
            <span className="logo-serif">Ralph</span>
            <span className="logo-sans">Lookbook</span>
          </span>
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
      <main className="main">{children}</main>
      <footer className="site-footer">
        <span className="logo-crest footer-crest" aria-hidden="true">
          RL
        </span>
        <p>
          A lookbook demo in the heritage tradition. Photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Timeless style, designed to last.
        </p>
      </footer>
    </div>
  );
}
