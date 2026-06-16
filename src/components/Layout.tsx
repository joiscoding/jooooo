import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <svg
              className="logo-mark"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 16V8l4 4 4-4v8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="logo-text">Studio Lookbook</span>
          </Link>

          <nav className="nav" aria-label="Main">
            <Link
              to="/#gallery"
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
            <a href="/#features" className="nav-link">
              Features
            </a>
          </nav>

          <div className="header-actions">
            <Link to="/albums" className="btn btn-ghost btn-sm">
              Sign in
            </Link>
            <Link to="/#gallery" className="btn btn-primary btn-sm">
              Browse looks
            </Link>
          </div>
        </div>
      </header>

      <main className={isHome ? 'main main-landing' : 'main'}>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo footer-logo">
              <svg
                className="logo-mark"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 16V8l4 4 4-4v8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="logo-text">Studio Lookbook</span>
            </Link>
            <p className="footer-tagline">
              Modern menswear, curated with intention.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h3 className="footer-heading">Product</h3>
              <Link to="/#gallery">Gallery</Link>
              <Link to="/albums">Albums</Link>
              <a href="/#features">Features</a>
            </div>
            <div className="footer-col">
              <h3 className="footer-heading">Styles</h3>
              <Link to="/#gallery">Minimal</Link>
              <Link to="/#gallery">Streetwear</Link>
              <Link to="/#gallery">Classic</Link>
            </div>
            <div className="footer-col">
              <h3 className="footer-heading">Resources</h3>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
              <a href="/#gallery">Seasonal edit</a>
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
            . Modern style, designed to last.
          </p>
        </div>
      </footer>
    </div>
  );
}
