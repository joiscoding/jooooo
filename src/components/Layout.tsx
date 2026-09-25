import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');
  const galleryActive = pathname === '/' || pathname.startsWith('/look');

  return (
    <div className={isHome ? 'layout layout-home' : 'layout'}>
      <header className="site-header">
        <div className="nav-bar">
          <Link to="/" className="logo" aria-label="Lookbook home">
            <span className="logo-word">lookbook</span>
            <svg className="logo-smile" viewBox="0 0 72 14" aria-hidden="true">
              <path
                d="M2 3c16 10 52 10 68 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link
              to="/"
              className={galleryActive ? 'nav-link active' : 'nav-link'}
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
          <div className="nav-actions">
            <Link to="/albums" className="nav-text">
              Your albums
            </Link>
            {isHome ? (
              <a href="#looks" className="nav-cta">
                Explore looks
              </a>
            ) : (
              <Link to="/" className="nav-cta">
                Explore looks
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">lookbook</p>
            <p>
              Men’s seasonal edits. Save looks into albums in this browser.
            </p>
          </div>
          <div>
            <p className="footer-heading">Explore</p>
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
          <div>
            <p className="footer-heading">Styles</p>
            <span>Minimal</span>
            <span>Streetwear</span>
            <span>Classic</span>
            <span>Athleisure</span>
            <span>Workwear</span>
          </div>
          <div>
            <p className="footer-heading">About</p>
            <p>
              Demo photos via{' '}
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
        </div>
        <div className="footer-base">
          <p>Demo lookbook. Modern style, designed to last.</p>
        </div>
      </footer>
    </div>
  );
}
