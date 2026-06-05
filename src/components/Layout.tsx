import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook · SS26</span>
        </Link>
        <div className="header-meta" aria-hidden="true">
          <span className="dot" />
          <span>Vol. 04 · Issue 26</span>
        </div>
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
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>
            <p className="colophon">
              Studio Lookbook — <em>modern style, designed to last.</em>
            </p>
            <p className="footer-mono">
              An editorial study in soft tailoring, undone polish and
              languid layers.
            </p>
          </div>
          <div>
            <h4>Edit</h4>
            <p>
              <Link to="/">Gallery</Link>
            </p>
            <p>
              <Link to="/albums">Albums</Link>
            </p>
          </div>
          <div>
            <h4>Colophon</h4>
            <p className="footer-mono">
              Photography via{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
              . Demo only — no checkout, no tracking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
