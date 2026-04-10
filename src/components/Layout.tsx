import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">Studio</span>
          <span className="logo-stack">
            <span className="logo-sans">Lookbook</span>
            <span className="logo-subline">B2B style hub</span>
          </span>
        </Link>
        <div className="header-actions">
          <nav className="nav">
            <Link
              to="/"
              className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Landing
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
          </nav>
          <span className="header-chip">Seasonal board ready</span>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="site-footer-title">Studio Lookbook / Inspiration concept</p>
          <p>
            Metro AG-inspired UX direction for a merchandised fashion landing page.
            Photos via{' '}
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
