import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  if (isHome) {
    return (
      <div className="layout layout--zara">
        <header className="zara-header">
          <div className="zara-header-inner">
            <nav className="zara-header-nav zara-header-nav--left" aria-label="Primary">
              <Link to="/" className="zara-header-link zara-header-link--active">
                Editorial
              </Link>
              <Link to="/albums" className="zara-header-link">
                Saved
              </Link>
            </nav>
            <Link to="/" className="zara-logo" aria-label="Home">
              ZARA
            </Link>
            <div className="zara-header-nav zara-header-nav--right" aria-hidden="true">
              <span className="zara-header-link zara-header-link--muted">Search</span>
              <span className="zara-header-link zara-header-link--muted">Bag (0)</span>
            </div>
          </div>
        </header>
        <main className="zara-main">{children}</main>
        <footer className="zara-footer">
          <div className="zara-footer-grid">
            <div>
              <p className="zara-footer-heading">Help</p>
              <ul className="zara-footer-links">
                <li>My account</li>
                <li>Shipping</li>
                <li>Returns</li>
              </ul>
            </div>
            <div>
              <p className="zara-footer-heading">Follow</p>
              <ul className="zara-footer-links">
                <li>Newsletter</li>
                <li>Instagram</li>
                <li>TikTok</li>
              </ul>
            </div>
            <div>
              <p className="zara-footer-heading">Company</p>
              <ul className="zara-footer-links">
                <li>About us</li>
                <li>Stores</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
          <p className="zara-footer-legal">
            Demo lookbook — imagery via{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
            . Not affiliated with Zara.
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav">
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
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p>
          Demo — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Modern style, designed to last.
        </p>
      </footer>
    </div>
  );
}
