import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-top">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              R
            </span>
            <span className="logo-text">Look Studio</span>
          </Link>

          {isHome && (
            <form
              className="header-search"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                className="header-search-input"
                placeholder="Search looks, styles, occasions…"
                aria-label="Search looks"
              />
              <button type="submit" className="header-search-btn">
                Search
              </button>
            </form>
          )}

          <nav className="header-util" aria-label="Account">
            <a href="#signin" className="header-util-link">
              Sign in
            </a>
            <a href="#register" className="header-util-link header-util-cta">
              Register
            </a>
          </nav>
        </div>

        <div className="header-tabs" role="navigation" aria-label="Site sections">
          <Link
            to="/"
            className={pathname === '/' ? 'header-tab active' : 'header-tab'}
          >
            Gallery
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'header-tab active' : 'header-tab'}
          >
            My Albums
          </Link>
          <span className="header-tab">Trending</span>
          <span className="header-tab">New Arrivals</span>
          <span className="header-tab">Sale</span>
        </div>
      </header>

      <main className={`main${isHome ? ' main--home' : ''}`}>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">Look Studio — Style is entertainment.</p>
          <p className="footer-meta">
            Demo lookbook — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Inspired by Rakuten Ichiba layout patterns.
          </p>
        </div>
      </footer>
    </div>
  );
}
