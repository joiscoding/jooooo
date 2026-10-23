import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">✳</span>
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
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
        </nav>
        <Link to="/albums" className="btn-pill dark header-cta">
          My albums
        </Link>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true">✳</span>
            <span className="logo-serif">Studio Lookbook</span>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
          <div className="footer-col">
            <h4>Credits</h4>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </div>
        </div>
        <p className="footer-note">
          Demo — photos via Unsplash. Modern style, designed to last.
        </p>
      </footer>
    </div>
  );
}
