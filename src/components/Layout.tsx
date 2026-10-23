import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAlbumsContext } from '../context/AlbumsContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { albums } = useAlbumsContext();

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-left">
          <Link to="/" className="logo" aria-label="Studio Lookbook home">
            <span className="logo-wordmark" aria-hidden="true">
              <span className="g-blue">S</span>
              <span className="g-red">t</span>
              <span className="g-yellow">u</span>
              <span className="g-blue">d</span>
              <span className="g-green">i</span>
              <span className="g-red">o</span>
            </span>
            <span className="logo-sans">Lookbook</span>
          </Link>
        </div>

        <nav className="nav" aria-label="Primary navigation">
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
            {albums.length > 0 && (
              <span className="nav-badge">{albums.length}</span>
            )}
          </Link>
          <Link
            to="/albums"
            className="header-icon-btn"
            aria-label="Saved albums"
            title="Saved albums"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-8c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-6 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
          </Link>
          <Link to="/albums" className="header-avatar" title="My Albums">
            S
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <span>Studio Lookbook — Men · Seasonal Edit</span>
        </div>
        <div className="footer-bottom">
          <div className="footer-links">
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
          <p className="footer-credit">
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
