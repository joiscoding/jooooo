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
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
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
            </Link>
          </nav>
          <span className="header-edition" aria-hidden="true">MEN / 2026</span>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p>Studio Lookbook</p>
          <p>Modern style, designed to last.</p>
          <p>Demo — photos via Unsplash.</p>
        </div>
      </footer>
    </div>
  );
}
