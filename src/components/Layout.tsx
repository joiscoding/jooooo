import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout layout--cloudera">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo" aria-label="Studio Lookbook home">
            <span className="logo-mark" aria-hidden>
              <span className="logo-mark-slash" />
            </span>
            <span className="logo-text">
              <span className="logo-word">Studio</span>
              <span className="logo-sub">Lookbook</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link
              to="/"
              className={isHome ? 'nav-link active' : 'nav-link'}
            >
              Gallery
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
            <a href="/#why-studio" className="nav-link">
              Why Studio
            </a>
            <a href="/#spotlight" className="nav-link">
              Spotlight
            </a>
          </nav>
          <div className="site-header-actions">
            <Link to="/albums" className="nav-link nav-link--quiet">
              Sign in
            </Link>
            <a href="/#browse-looks" className="cdp-btn cdp-btn--primary cdp-btn--sm">
              Explore looks
            </a>
          </div>
        </div>
      </header>
      <main className={isHome ? 'main main--flush' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo logo--footer" aria-label="Studio Lookbook home">
              <span className="logo-mark" aria-hidden>
                <span className="logo-mark-slash" />
              </span>
              <span className="logo-text">
                <span className="logo-word">Studio</span>
                <span className="logo-sub">Lookbook</span>
              </span>
            </Link>
            <p className="footer-tagline">
              The hybrid edit for modern menswear — curated looks anywhere you
              browse, save, and style.
            </p>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Gallery</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
              <li>
                <a href="/#browse-looks">Style filters</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li>
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
                  Unsplash photos
                </a>
              </li>
              <li>
                <a href="/#why-studio">Why Studio</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Get started</h3>
            <p className="footer-copy">
              Browse the seasonal edit, then save looks into albums that persist
              in this browser.
            </p>
            <a href="/#browse-looks" className="cdp-btn cdp-btn--primary cdp-btn--sm">
              Browse the gallery
            </a>
          </div>
        </div>
        <div className="site-footer-legal">
          <p>
            © {new Date().getFullYear()} Studio Lookbook (demo). Visual language
            inspired by enterprise hybrid-platform marketing — not affiliated
            with Cloudera. Photos via{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
