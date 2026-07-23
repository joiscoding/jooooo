import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className={isHome ? 'layout layout-home' : 'layout'}>
      <header className="site-header">
        <Link to="/" className="logo" aria-label="Studio Lookbook home">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-word">Studio</span>
        </Link>
        <nav className="nav" aria-label="Primary">
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
            Start collecting
          </Link>
        </nav>
      </header>
      <main className={isHome ? 'main main-flush' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-word">Studio</span>
          </div>
          <p>
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
