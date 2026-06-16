import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="promo-bar">
        <p>Spring Collection — Explore the Seasonal Edit</p>
      </div>

      <header className="site-header">
        <nav className="nav nav-left" aria-label="Primary left">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Lookbook
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Collections
          </Link>
        </nav>

        <Link to="/" className="logo" aria-label="Studio Lookbook home">
          <span className="logo-mark">Studio</span>
          <span className="logo-sub">Lookbook</span>
        </Link>

        <nav className="nav nav-right" aria-label="Primary right">
          <span className="nav-link nav-static">Heritage</span>
          <span className="nav-link nav-static">About</span>
        </nav>
      </header>

      <main className={isHome ? 'main main--full' : 'main'}>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Studio Lookbook</span>
            <p className="footer-tagline">
              Timeless style, designed to last.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h3>Explore</h3>
              <Link to="/">Lookbook</Link>
              <Link to="/albums">Collections</Link>
            </div>
            <div className="footer-col">
              <h3>Style</h3>
              <span>Classic</span>
              <span>Heritage</span>
              <span>Seasonal</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Demo — photos via{' '}
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
