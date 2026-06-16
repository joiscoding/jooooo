import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="utility-bar">
        <span>Complimentary shipping on the seasonal collection</span>
      </div>
      <header className="site-header">
        <nav className="nav nav-left">
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
        <Link to="/" className="logo">
          <span className="logo-crest" aria-hidden="true">✦</span>
          <span className="logo-serif">Ralph &amp; Co.</span>
          <span className="logo-sans">Heritage Lookbook</span>
        </Link>
        <div className="nav nav-right">
          <Link to="/albums" className="nav-link">
            Atelier
          </Link>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p className="footer-mark">Ralph &amp; Co.</p>
        <p>
          A heritage lookbook demo — photography via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Timeless style, made to endure.
        </p>
      </footer>
    </div>
  );
}
