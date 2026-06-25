import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header
        className={
          isHome ? 'site-header' : 'site-header site-header--bordered'
        }
      >
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden />
          <span className="logo-text">Studio Lookbook</span>
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
          <Link to="/albums" className="nav-cta">
            Save looks
          </Link>
        </nav>
      </header>
      <main className={isHome ? 'main main--full' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
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
          <div className="site-footer-links">
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
