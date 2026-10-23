import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  const isHome = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo" aria-label="Studio Lookbook home">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-word">Studio</span>
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
        <div className="header-actions">
          <Link to="/albums" className="header-text">
            Saved looks
          </Link>
          <Link to={isHome ? '/#looks' : '/'} className="btn primary header-cta">
            {isHome ? 'Browse looks' : 'Gallery'}
          </Link>
        </div>
      </header>
      <main className={isHome ? 'main main-home' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Studio Lookbook</p>
            <p className="footer-note">Modern style, designed to last.</p>
          </div>
          <div className="footer-col">
            <p className="footer-label">Lookbook</p>
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
          <div className="footer-col">
            <p className="footer-label">Photos</p>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </div>
        </div>
        <p className="footer-legal">
          Demo — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
