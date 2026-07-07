import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">S</span>
          <span className="logo-text">
            Studio<strong>Lookbook</strong>
          </span>
        </Link>
        <div className="header-search" role="search">
          <input
            type="search"
            className="header-search-input"
            placeholder="Search looks, styles, and more"
            aria-label="Search looks"
          />
          <button type="button" className="header-search-btn">
            Search
          </button>
        </div>
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
      <div className="header-subbar">
        <span className="subbar-item highlight">Super Point Up ★</span>
        <span className="subbar-item">Daily Deals</span>
        <span className="subbar-item">New Arrivals</span>
        <span className="subbar-item">Rankings</span>
        <span className="subbar-item">Coupons</span>
      </div>
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
