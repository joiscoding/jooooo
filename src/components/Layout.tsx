import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="utility-inner">
          <span>Men’s seasonal lookbook</span>
          <span>Edition 01 · 2026</span>
        </div>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="Studio Lookbook home">
            <span className="logo-mark" aria-hidden="true">S</span>
            <span className="logo-wordmark">
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
      <main className="main" id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">Studio Lookbook</p>
            <p>Modern menswear, curated for everyday confidence.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Photo credits
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
