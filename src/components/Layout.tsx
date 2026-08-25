import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        <p>Seasonal edit · 14 curated looks</p>
        <span>Modern style, designed to last</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="Studio Lookbook home">
            <span className="logo-mark" aria-hidden="true">
              sl
            </span>
            <span className="logo-name">
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            <Link
              to="/"
              className={pathname === '/' ? 'nav-link active' : 'nav-link'}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Looks
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
              aria-current={isAlbums ? 'page' : undefined}
            >
              Albums
            </Link>
          </nav>
          <Link to="/albums" className="header-action">
            View albums
          </Link>
        </div>
      </header>
      <main className="main" id="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">Studio Lookbook</p>
            <p>Modern style, designed to last.</p>
          </div>
          <p>
            Demo · Photos via{' '}
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
