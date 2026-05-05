import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout layout--aws">
      <div className="aws-utility" aria-label="Utility links">
        <div className="aws-utility-inner">
          <span className="aws-utility-brand">
            This is a demo experience inspired by cloud product marketing pages.
          </span>
          <div className="aws-utility-links">
            <a href="https://unsplash.com" className="aws-utility-link">
              Image credits
            </a>
            <Link to="/albums" className="aws-utility-link">
              Support &amp; docs
            </Link>
            <span className="aws-utility-sep" aria-hidden>
              |
            </span>
            <button type="button" className="aws-utility-btn">
              Sign in
            </button>
            <Link to="/albums" className="aws-cta aws-cta--sm">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-header-left">
            <Link to="/" className="logo" aria-label="Studio Lookbook home">
              <span className="logo-mark" aria-hidden />
              <span className="logo-text">Studio Lookbook</span>
            </Link>
            <nav className="nav" aria-label="Primary">
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
              <span className="nav-link nav-link--muted">Lookbook</span>
            </nav>
          </div>
          <div className="site-header-right">
            <label className="header-search" htmlFor="site-search">
              <span className="visually-hidden">Search</span>
              <input
                id="site-search"
                type="search"
                className="header-search-input"
                placeholder="Search looks, tags, albums…"
                autoComplete="off"
              />
            </label>
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Gallery</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li>
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
                  Unsplash
                </a>
              </li>
              <li>
                <a href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">
                  React Router
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">About this demo</h3>
            <p className="footer-copy">
              Editorial men&apos;s looks with a layout that echoes enterprise cloud
              marketing sites—clean hierarchy, utility chrome, and strong calls to
              action.
            </p>
          </div>
        </div>
        <div className="site-footer-legal">
          <p>
            © {new Date().getFullYear()} Studio Lookbook (demo). Photos from{' '}
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
