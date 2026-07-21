import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            S
          </span>
          <span className="logo-copy">
            <strong>Studio</strong>
            <span>Lookbook systems</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Look systems
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
            aria-current={isAlbums ? 'page' : undefined}
          >
            Saved albums
          </Link>
        </nav>
      </header>
      <main className="main" id="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-kicker">Studio Lookbook / Men</span>
          <p>Modular style, considered for the long run.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Look systems</Link>
          <Link to="/albums">Saved albums</Link>
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Photography via Unsplash
          </a>
        </div>
        <p className="footer-note">Independent concept demo · 2026</p>
      </footer>
    </div>
  );
}
