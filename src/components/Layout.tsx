import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">SL</span>
          <span className="logo-word">Studio Lookbook</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            The edit
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Saved looks
          </Link>
        </nav>
        <Link to="/albums" className="header-save-link">
          <span>Albums</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p>
          Studio Lookbook <span aria-hidden="true">·</span> Modern style,
          designed to last.
          {' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Image source
          </a>
        </p>
      </footer>
    </div>
  );
}
