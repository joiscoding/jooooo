import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isLanding = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <header className={isLanding ? 'site-header lp-header' : 'site-header'}>
        <Link to="/" className="logo">
          <span className="logo-serif">FASCO</span>
        </Link>

        <button
          type="button"
          className={menuOpen ? 'hamburger open' : 'hamburger'}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <Link
            to="/"
            className={isLanding ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/gallery"
            className={pathname === '/gallery' ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
            onClick={() => setMenuOpen(false)}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className={isLanding ? 'main main-landing' : 'main'}>
        {children}
      </main>
      <footer className="site-footer lp-footer">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <Link to="/" className="logo">
              <span className="logo-serif">FASCO</span>
            </Link>
          </div>
          <nav className="lp-footer-links">
            <Link to="/gallery">Gallery</Link>
            <Link to="/albums">Albums</Link>
            <Link to="/">Collections</Link>
          </nav>
        </div>
        <div className="lp-footer-bottom">
          <p>
            Copyright © 2026 FASCO. All rights reserved. Photos via{' '}
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
      </footer>
    </div>
  );
}
