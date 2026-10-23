import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">S</span>
          <span className="logo-word">Studio Lookbook</span>
        </Link>
        <nav className="nav">
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
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div>
          <Link to="/" className="footer-brand">Studio Lookbook</Link>
          <p>Modern style, designed to last.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Gallery</Link>
          <Link to="/albums">Albums</Link>
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Photos via Unsplash
          </a>
        </div>
      </footer>
    </div>
  );
}
