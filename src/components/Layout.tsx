import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="utility-bar">
        <div className="utility-bar-inner">
          <div className="utility-links">
            <a href="#gallery">Gallery</a>
            <a href="#collections">Collections</a>
            <a href="#about">About</a>
          </div>
          <div className="utility-lang">
            <span className="lang-active">EN</span>
            <span className="lang-sep">|</span>
            <span className="lang-muted">中文</span>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              SL
            </span>
            <span className="logo-text">
              <span className="logo-name">Studio Lookbook</span>
              <span className="logo-sub">Investor Relations</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link
              to="/"
              className={isHome ? 'nav-link active' : 'nav-link'}
            >
              Home
            </Link>
            <Link
              to="/"
              className="nav-link"
            >
              Corporate Info
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Collections
            </Link>
            <Link
              to="/"
              className="nav-link"
            >
              Announcements
            </Link>
            <Link
              to="/albums"
              className="nav-link"
            >
              Financials
            </Link>
          </nav>
        </div>
      </header>

      <main className={`main${isHome ? ' main--ir' : ''}`}>{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
            <a href="#contact">Contact IR</a>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photo Credits
            </a>
          </div>
          <p className="footer-copy">
            Copyright {new Date().getFullYear()} Studio Lookbook. All Rights
            Reserved. Demo — photos via Unsplash.
          </p>
        </div>
      </footer>
    </div>
  );
}
