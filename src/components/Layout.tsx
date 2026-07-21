import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Studio Lookbook
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            <Link
              to="/"
              className={pathname === '/' ? 'nav-link active' : 'nav-link'}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Gallery
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
              aria-current={isAlbums ? 'page' : undefined}
            >
              Albums
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p>Studio Lookbook</p>
          <p>
            Images via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
