import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAlbumsContext } from '../context/AlbumsContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { albums } = useAlbumsContext();
  const isAlbums = pathname.startsWith('/albums');
  const savedCount = albums.reduce((n, a) => n + a.lookIds.length, 0);

  return (
    <div className="layout">
      <p className="announce">
        New season looks are in. Albums save in this browser — no account
        needed.
      </p>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Looks
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
            {savedCount > 0 && (
              <span className="nav-badge" aria-label={`${savedCount} saved`}>
                {savedCount}
              </span>
            )}
          </Link>
        </nav>
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
