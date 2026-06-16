import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-word">Studio Lookbook</span>
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
          </nav>
          <Link to="/albums" className="header-cta">
            Start an album
          </Link>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <span className="logo-word">Studio Lookbook</span>
            <p className="footer-tagline">Modern style, designed to last.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h3 className="footer-heading">Explore</h3>
              <Link to="/">Gallery</Link>
              <Link to="/albums">Albums</Link>
            </div>
            <div className="footer-col">
              <h3 className="footer-heading">Edits</h3>
              <Link to="/">Minimal</Link>
              <Link to="/">Streetwear</Link>
              <Link to="/">Classic</Link>
            </div>
            <div className="footer-col">
              <h3 className="footer-heading">About</h3>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Photography
              </a>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} Studio Lookbook — a design demo.</p>
          <p>
            Photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
