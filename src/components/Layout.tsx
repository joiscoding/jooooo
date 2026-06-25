import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="top-bar">
        <div className="top-bar-inner">
          <span>Modern style, designed to last</span>
          <span className="top-bar-divider" aria-hidden>
            |
          </span>
          <span>Men&apos;s seasonal lookbook</span>
        </div>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden>
              S
            </span>
            <span className="logo-text">
              <span className="logo-name">Studio Lookbook</span>
              <span className="logo-tagline">Modern style, designed to last</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Main">
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
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Studio Lookbook</span>
            <p className="footer-tagline">
              Men&apos;s seasonal edits — quiet confidence through strong
              photography and restrained design.
            </p>
          </div>
          <div className="footer-columns">
            <div className="footer-col">
              <h3 className="footer-heading">Browse</h3>
              <Link to="/" className="footer-link">
                Gallery
              </Link>
              <Link to="/albums" className="footer-link">
                Saved albums
              </Link>
            </div>
            <div className="footer-col">
              <h3 className="footer-heading">Styles</h3>
              <span className="footer-link muted-link">Minimal / quiet</span>
              <span className="footer-link muted-link">Streetwear / urban</span>
              <span className="footer-link muted-link">Classic / tailored</span>
            </div>
            <div className="footer-col">
              <h3 className="footer-heading">Credits</h3>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Photos via Unsplash
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Studio Lookbook — Demo project.</p>
        </div>
      </footer>
    </div>
  );
}
