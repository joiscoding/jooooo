import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-word">
            STUDIO<span className="logo-word-accent">LOOKBOOK</span>
          </span>
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
          <Link to="/" className="nav-cta">
            Explore looks
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true" />
            <span className="footer-brand-name">StudioLookbook</span>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photos via Unsplash
            </a>
          </nav>
          <p className="footer-note">
            Demo — modern style, designed to last. Wherever you wear it.
          </p>
        </div>
      </footer>
    </div>
  );
}
